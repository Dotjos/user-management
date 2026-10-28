export type UserStatus = 'Active' | 'Inactive';

export type UserRole = string;

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: UserStatus;
}

export type SortField = 'id' | 'name' | 'email' | 'role' | 'status';
export type SortOrder = 'asc' | 'desc';

export interface UserFilters {
  search: string;
  status: 'All' | UserStatus;
  role: 'All' | string;
  sortBy: SortField;
  sortOrder: SortOrder;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
}

export interface CreateUserInput {
  name: string;
  email: string;
  role: string;
  status: UserStatus;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: string;
  status?: UserStatus;
}
