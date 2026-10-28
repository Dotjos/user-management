import React from 'react';
import { User, UserStatus, SortField } from '../types/user';
import { UserTableRow } from './UserTableRow';
import { ArrowUp, ArrowDown, Users, AlertCircle, RefreshCw, RotateCcw } from 'lucide-react';

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  error: string | null;
  selectedIds: Set<string>;
  isAllSelected: boolean;
  sortBy: SortField;
  sortOrder: 'asc' | 'desc';
  onToggleSelectAll: () => void;
  onToggleSelect: (id: string) => void;
  onSort: (field: SortField) => void;
  onUpdateStatus: (id: string, status: UserStatus) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
  onRetry: () => void;
  onResetFilters: () => void;
  onRequestStatusChangeConfirm?: (user: User, newStatus: UserStatus) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  isLoading,
  error,
  selectedIds,
  isAllSelected,
  sortBy,
  sortOrder,
  onToggleSelectAll,
  onToggleSelect,
  onSort,
  onUpdateStatus,
  onEditUser,
  onDeleteUser,
  onRetry,
  onResetFilters,
  onRequestStatusChangeConfirm
}) => {
  const renderSortIcon = (field: SortField) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-blue-600 inline ml-1 shrink-0" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-blue-600 inline ml-1 shrink-0" />
    );
  };

  // Error State
  if (error) {
    return (
      <div className="bg-white rounded-xl border border-rose-200 p-8 text-center shadow-sm">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-gray-900">Failed to connect to backend</h3>
        <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry connection</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* Table Header designed to match { id, name, email, role, status } */}
          <thead className="bg-gray-50/80 border-b border-gray-200/80 text-[11px] font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-header-group">
            <tr>
              <th scope="col" className="w-12 px-4 py-3.5 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleSelectAll}
                  aria-label="Select all visible users"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/30 cursor-pointer"
                />
              </th>
              <th scope="col" className="w-16 px-4 py-3.5">
                <button
                  type="button"
                  onClick={() => onSort('id')}
                  className="flex items-center gap-1 hover:text-gray-900 focus:outline-none transition-colors cursor-pointer"
                >
                  <span>ID</span>
                  {renderSortIcon('id')}
                </button>
              </th>
              <th scope="col" className="px-4 py-3.5">
                <button
                  type="button"
                  onClick={() => onSort('name')}
                  className="flex items-center gap-1 hover:text-gray-900 focus:outline-none transition-colors cursor-pointer"
                >
                  <span>Name</span>
                  {renderSortIcon('name')}
                </button>
              </th>
              <th scope="col" className="px-4 py-3.5">
                <button
                  type="button"
                  onClick={() => onSort('email')}
                  className="flex items-center gap-1 hover:text-gray-900 focus:outline-none transition-colors cursor-pointer"
                >
                  <span>Email</span>
                  {renderSortIcon('email')}
                </button>
              </th>
              <th scope="col" className="px-4 py-3.5">
                <button
                  type="button"
                  onClick={() => onSort('role')}
                  className="flex items-center gap-1 hover:text-gray-900 focus:outline-none transition-colors cursor-pointer"
                >
                  <span>Role</span>
                  {renderSortIcon('role')}
                </button>
              </th>
              <th scope="col" className="px-4 py-3.5">
                <button
                  type="button"
                  onClick={() => onSort('status')}
                  className="flex items-center gap-1 hover:text-gray-900 focus:outline-none transition-colors cursor-pointer"
                >
                  <span>Status</span>
                  {renderSortIcon('status')}
                </button>
              </th>
              <th scope="col" className="px-4 py-3.5 text-right">
                <span className="sr-only">Actions</span>
                <span>Actions</span>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              // Loading Skeleton Rows
              Array.from({ length: 6 }).map((_, idx) => (
                <tr key={`skeleton-${idx}`} className="animate-pulse">
                  <td className="px-4 py-4 text-center">
                    <div className="w-4 h-4 bg-gray-200 rounded mx-auto" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-gray-200 rounded w-8" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
                      <div className="h-3.5 bg-gray-200 rounded w-28" />
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-3.5 bg-gray-100 rounded w-44" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-5 bg-gray-200 rounded-md w-36" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-6 bg-gray-200 rounded-full w-20" />
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="h-7 bg-gray-200 rounded-lg w-16 ml-auto" />
                  </td>
                </tr>
              ))
            ) : users.length > 0 ? (
              users.map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  isSelected={selectedIds.has(user.id)}
                  onToggleSelect={onToggleSelect}
                  onUpdateStatus={onUpdateStatus}
                  onEditUser={onEditUser}
                  onDeleteUser={onDeleteUser}
                  onRequestStatusChangeConfirm={onRequestStatusChangeConfirm}
                />
              ))
            ) : (
              // Empty State
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center">
                  <div className="max-w-sm mx-auto space-y-3">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 mx-auto flex items-center justify-center">
                      <Users className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-gray-900">No users found</h4>
                      <p className="text-xs text-gray-500">
                        No accounts match your current search and filter criteria.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={onResetFilters}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset all filters</span>
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
