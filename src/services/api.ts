import { User, UserStatus, UserStats, CreateUserInput, UpdateUserInput } from '../types/user';

export interface FetchUsersResponse {
  users: User[];
  total: number;
  stats: UserStats;
}

export class ApiError extends Error {
  statusCode?: number;
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const errorMsg = data?.error || data?.message || `Request failed with status ${res.status}`;
    throw new ApiError(errorMsg, res.status);
  }
  return data as T;
}

export const userApi = {
  /**
   * Fetches the user list from the backend with optional search & filter parameters
   */
  async getUsers(params?: { search?: string; status?: string; role?: string }): Promise<FetchUsersResponse> {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.status && params.status !== 'All') query.set('status', params.status);
    if (params?.role && params.role !== 'All') query.set('role', params.role);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`/api/users${queryString}`);
    return handleResponse<FetchUsersResponse>(res);
  },

  /**
   * Updates an individual user's account status
   */
  async updateStatus(userId: string, status: UserStatus): Promise<{ user: User; message: string }> {
    const res = await fetch(`/api/users/${userId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return handleResponse<{ user: User; message: string }>(res);
  },

  /**
   * Bulk updates multiple users to a new account status
   */
  async bulkUpdateStatus(userIds: string[], status: UserStatus): Promise<{ updatedCount: number; status: UserStatus; message: string }> {
    const res = await fetch(`/api/users/bulk-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userIds, status })
    });
    return handleResponse<{ updatedCount: number; status: UserStatus; message: string }>(res);
  },

  /**
   * Creates a new user in the backend
   */
  async createUser(input: CreateUserInput): Promise<{ user: User; message: string }> {
    const res = await fetch(`/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
    return handleResponse<{ user: User; message: string }>(res);
  },

  /**
   * Updates an existing user's details
   */
  async updateUser(userId: string, input: UpdateUserInput): Promise<{ user: User; message: string }> {
    const res = await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
    return handleResponse<{ user: User; message: string }>(res);
  },

  /**
   * Deletes a user by ID
   */
  async deleteUser(userId: string): Promise<{ success: boolean; id: string; message: string }> {
    const res = await fetch(`/api/users/${userId}`, {
      method: 'DELETE'
    });
    return handleResponse<{ success: boolean; id: string; message: string }>(res);
  },

  /**
   * Resets the backend database to original demo seeds
   */
  async resetDatabase(): Promise<{ message: string; count: number }> {
    const res = await fetch('/api/reset', {
      method: 'POST'
    });
    return handleResponse<{ message: string; count: number }>(res);
  }
};
