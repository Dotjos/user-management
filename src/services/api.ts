import { User, UserStatus, UserStats, CreateUserInput, UpdateUserInput } from '../types/user';

export const API_BASE_URL = 'https://6ae1eb66bbb5412922995b6b.mockapi.io/usermanagement/users';

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

/**
 * Normalizes raw user objects from the backend MockAPI endpoint
 * Ensures standard status casing ('Active' | 'Inactive') and string types.
 */
export function normalizeUser(raw: any): User {
  const rawStatus = (raw.status || '').toString().trim().toLowerCase();
  const status: UserStatus = rawStatus === 'active' ? 'Active' : 'Inactive';

  return {
    id: String(raw.id),
    name: String(raw.name || '').trim(),
    email: String(raw.email || '').trim(),
    role: String(raw.role || '').trim(),
    status
  };
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
   * Fetches users from https://6ae1eb66bbb5412922995b6b.mockapi.io/usermanagement/users
   */
  async getUsers(params?: { search?: string; status?: string; role?: string }): Promise<FetchUsersResponse> {
    const res = await fetch(API_BASE_URL);
    const rawList = await handleResponse<any[]>(res);

    let users = (Array.isArray(rawList) ? rawList : []).map(normalizeUser);

    // Filter by search query if provided
    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      users = users.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q) ||
          u.id.includes(q)
      );
    }

    // Filter by status if specified
    if (params?.status && params.status !== 'All') {
      users = users.filter((u) => u.status === params.status);
    }

    // Filter by role if specified
    if (params?.role && params.role !== 'All') {
      users = users.filter((u) => u.role === params.role);
    }

    const stats: UserStats = {
      total: users.length,
      active: users.filter((u) => u.status === 'Active').length,
      inactive: users.filter((u) => u.status === 'Inactive').length
    };

    return {
      users,
      total: users.length,
      stats
    };
  },

  /**
   * Updates an individual user's account status in the backend
   */
  async updateStatus(userId: string, status: UserStatus): Promise<{ user: User; message: string }> {
    const res = await fetch(`${API_BASE_URL}/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const updatedRaw = await handleResponse<any>(res);
    const user = normalizeUser(updatedRaw);

    return {
      user,
      message: `Status updated to ${status} for ${user.name}`
    };
  },

  /**
   * Bulk updates multiple users to a new account status
   */
  async bulkUpdateStatus(userIds: string[], status: UserStatus): Promise<{ updatedCount: number; status: UserStatus; message: string }> {
    const promises = userIds.map((id) =>
      fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
    );

    const results = await Promise.allSettled(promises);
    const successCount = results.filter((r) => r.status === 'fulfilled').length;

    return {
      updatedCount: successCount,
      status,
      message: `Successfully updated ${successCount} users to ${status}`
    };
  },

  /**
   * Creates a new user in the backend
   */
  async createUser(input: CreateUserInput): Promise<{ user: User; message: string }> {
    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: input.name,
        email: input.email,
        role: input.role,
        status: input.status
      })
    });
    const createdRaw = await handleResponse<any>(res);
    const user = normalizeUser(createdRaw);

    return {
      user,
      message: `User ${user.name} created successfully`
    };
  },

  /**
   * Updates an existing user's details
   */
  async updateUser(userId: string, input: UpdateUserInput): Promise<{ user: User; message: string }> {
    const res = await fetch(`${API_BASE_URL}/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...(input.name ? { name: input.name } : {}),
        ...(input.email ? { email: input.email } : {}),
        ...(input.role ? { role: input.role } : {}),
        ...(input.status ? { status: input.status } : {})
      })
    });
    const updatedRaw = await handleResponse<any>(res);
    const user = normalizeUser(updatedRaw);

    return {
      user,
      message: `User ${user.name} updated successfully`
    };
  },

  /**
   * Deletes a user by ID from the backend
   */
  async deleteUser(userId: string): Promise<{ success: boolean; id: string; message: string }> {
    const res = await fetch(`${API_BASE_URL}/${userId}`, {
      method: 'DELETE'
    });
    await handleResponse<any>(res);

    return {
      success: true,
      id: userId,
      message: `User removed successfully`
    };
  },

  /**
   * Refreshes user dataset from the API
   */
  async resetDatabase(): Promise<{ message: string; count: number }> {
    const data = await this.getUsers();
    return {
      message: 'User dataset refreshed from API',
      count: data.total
    };
  }
};
