export type UserStatus = 'Active' | 'Pending' | 'Suspended' | 'Inactive';

export type UserRole = 'Admin' | 'Manager' | 'Developer' | 'Designer' | 'Support';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl: string;
  department: string;
  location: string;
  createdAt: string;
  lastActiveAt: string;
  notes?: string;
}

export type SortField = 'name' | 'createdAt' | 'lastActiveAt' | 'role' | 'status';
export type SortOrder = 'asc' | 'desc';

export interface UserFilters {
  search: string;
  status: 'All' | UserStatus;
  role: 'All' | UserRole;
  sortBy: SortField;
  sortOrder: SortOrder;
}

export interface UserStats {
  total: number;
  active: number;
  pending: number;
  suspended: number;
  inactive: number;
}

export interface CreateUserInput {
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  department: string;
  location: string;
  notes?: string;
}

export interface UpdateUserInput extends Partial<CreateUserInput> {
  status?: UserStatus;
}
