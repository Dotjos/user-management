import React, { useRef, useEffect } from 'react';
import { UserFilters as FilterStateType, UserStatus, UserRole, SortField } from '../types/user';
import { Search, X, RotateCcw, Filter } from 'lucide-react';

interface UserFiltersProps {
  filters: FilterStateType;
  hasActiveFilters: boolean;
  totalFiltered: number;
  totalRaw: number;
  availableRoles?: string[];
  onSearchChange: (query: string) => void;
  onStatusChange: (status: 'All' | UserStatus) => void;
  onRoleChange: (role: 'All' | UserRole) => void;
  onSortChange: (field: SortField) => void;
  onSortOrderToggle: () => void;
  onResetFilters: () => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  filters,
  hasActiveFilters,
  totalFiltered,
  totalRaw,
  availableRoles = [],
  onSearchChange,
  onStatusChange,
  onRoleChange,
  onSortChange,
  onSortOrderToggle,
  onResetFilters
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: pressing '/' focuses the search box
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === '/' && document.activeElement !== searchInputRef.current && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-sm space-y-3">
      {/* Top row: Search and dropdowns */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={filters.search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, email, role, or ID... (press '/' to focus)"
            className="w-full pl-10 pr-9 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50/40 hover:bg-white"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Dropdown */}
        <select
          value={filters.status}
          onChange={(e) => onStatusChange(e.target.value as 'All' | UserStatus)}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 bg-gray-50/40 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer min-w-[140px]"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        {/* Role Dropdown */}
        <select
          value={filters.role}
          onChange={(e) => onRoleChange(e.target.value as 'All' | UserRole)}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 bg-gray-50/40 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer min-w-[140px]"
        >
          <option value="All">All Roles</option>
          {availableRoles.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        {/* Sort Dropdown */}
        <select
          value={filters.sortBy}
          onChange={(e) => onSortChange(e.target.value as SortField)}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 bg-gray-50/40 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer min-w-[130px]"
        >
          <option value="id">Sort by ID</option>
          <option value="name">Sort by Name</option>
          <option value="email">Sort by Email</option>
          <option value="role">Sort by Role</option>
          <option value="status">Sort by Status</option>
        </select>

        {/* Sort Order Toggle */}
        <button
          type="button"
          onClick={onSortOrderToggle}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 bg-gray-50/40 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          aria-label={`Sort ${filters.sortOrder === 'asc' ? 'descending' : 'ascending'}`}
          title={filters.sortOrder === 'asc' ? 'Ascending ↑' : 'Descending ↓'}
        >
          {filters.sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
        </button>
      </div>

      {/* Bottom meta row: Results count and Reset Button */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-gray-400" />
          <span>
            Showing <strong className="text-gray-900">{totalFiltered}</strong> of{' '}
            <strong className="text-gray-900">{totalRaw}</strong> users
          </span>
          {hasActiveFilters && (
            <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-medium">
              Filters applied
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
