import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserFilters } from './UserFilters';
import { UserFilters as FilterStateType } from '../types/user';

const defaultFilters: FilterStateType = {
  search: '',
  status: 'All',
  role: 'All',
  sortBy: 'id',
  sortOrder: 'asc'
};

describe('UserFilters component', () => {
  it('renders search input, status and role selectors', () => {
    render(
      <UserFilters
        filters={defaultFilters}
        hasActiveFilters={false}
        totalFiltered={14}
        totalRaw={14}
        onSearchChange={vi.fn()}
        onStatusChange={vi.fn()}
        onRoleChange={vi.fn()}
        onSortChange={vi.fn()}
        onSortOrderToggle={vi.fn()}
        onResetFilters={vi.fn()}
      />
    );

    expect(screen.getByPlaceholderText(/Search by name, email, role/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('All Statuses')).toBeInTheDocument();
    expect(screen.getByDisplayValue('All Roles')).toBeInTheDocument();
    expect(screen.getByText(/Showing/)).toBeInTheDocument();
  });

  it('triggers onSearchChange when typing in the search box', () => {
    const handleSearchChange = vi.fn();
    render(
      <UserFilters
        filters={defaultFilters}
        hasActiveFilters={false}
        totalFiltered={14}
        totalRaw={14}
        onSearchChange={handleSearchChange}
        onStatusChange={vi.fn()}
        onRoleChange={vi.fn()}
        onSortChange={vi.fn()}
        onSortOrderToggle={vi.fn()}
        onResetFilters={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText(/Search by name, email, role/i);
    fireEvent.change(input, { target: { value: 'Sarah' } });

    expect(handleSearchChange).toHaveBeenCalledWith('Sarah');
  });

  it('triggers onStatusChange when selecting a status option', () => {
    const handleStatusChange = vi.fn();
    render(
      <UserFilters
        filters={defaultFilters}
        hasActiveFilters={false}
        totalFiltered={14}
        totalRaw={14}
        onSearchChange={vi.fn()}
        onStatusChange={handleStatusChange}
        onRoleChange={vi.fn()}
        onSortChange={vi.fn()}
        onSortOrderToggle={vi.fn()}
        onResetFilters={vi.fn()}
      />
    );

    const statusSelect = screen.getByDisplayValue('All Statuses');
    fireEvent.change(statusSelect, { target: { value: 'Inactive' } });

    expect(handleStatusChange).toHaveBeenCalledWith('Inactive');
  });

  it('shows reset button when hasActiveFilters is true and calls onResetFilters', () => {
    const handleReset = vi.fn();
    render(
      <UserFilters
        filters={{ ...defaultFilters, search: 'Sarah' }}
        hasActiveFilters={true}
        totalFiltered={1}
        totalRaw={14}
        onSearchChange={vi.fn()}
        onStatusChange={vi.fn()}
        onRoleChange={vi.fn()}
        onSortChange={vi.fn()}
        onSortOrderToggle={vi.fn()}
        onResetFilters={handleReset}
      />
    );

    const resetBtn = screen.getByText('Reset filters');
    expect(resetBtn).toBeInTheDocument();
    fireEvent.click(resetBtn);
    expect(handleReset).toHaveBeenCalled();
  });
});
