import React, { useRef, useEffect } from 'react';
import { UserFilters as FilterStateType, UserStatus, UserRole, SortField } from '../types/user';
import { Search, X, RotateCcw, ArrowUpDown, Filter, ChevronDown } from 'lucide-react';

interface UserFiltersProps {
  filters: FilterStateType;
  hasActiveFilters: boolean;
  totalFiltered: number;
  totalRaw: number;
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
      {/* Top row: Search and primary selects */}
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
            placeholder="Search by name, email, department, role... (press '/' to focus)"
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

        {/* Filter Selects */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          {/* Status Filter */}
          <div className="relative min-w-[140px] flex-1 sm:flex-initial">
            <select
              value={filters.status}
              onChange={(e) => onStatusChange(e.target.value as 'All' | UserStatus)}
              className="w-full appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-800 font-medium hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Suspended">Suspended</option>
              <option value="Inactive">Inactive</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Role Filter */}
          <div className="relative min-w-[130px] flex-1 sm:flex-initial">
            <select
              value={filters.role}
              onChange={(e) => onRoleChange(e.target.value as 'All' | UserRole)}
              className="w-full appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-800 font-medium hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Developer">Developer</option>
              <option value="Designer">Designer</option>
              <option value="Support">Support</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort By Field */}
          <div className="relative min-w-[140px] flex-1 sm:flex-initial">
            <select
              value={filters.sortBy}
              onChange={(e) => onSortChange(e.target.value as SortField)}
              className="w-full appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-800 font-medium hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
            >
              <option value="createdAt">Date Joined</option>
              <option value="lastActiveAt">Last Active</option>
              <option value="name">Name</option>
              <option value="role">Role</option>
              <option value="status">Status</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort Order Toggle */}
          <button
            type="button"
            onClick={onSortOrderToggle}
            title={`Sort ${filters.sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            className="p-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
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
