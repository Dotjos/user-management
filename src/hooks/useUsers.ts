import { useState, useEffect, useMemo, useCallback } from 'react';
import { User, UserStatus, UserRole, UserFilters, SortField, SortOrder, UserStats, CreateUserInput, UpdateUserInput } from '../types/user';
import { userApi } from '../services/api';
import { useToast } from '../context/ToastContext';

const DEFAULT_FILTERS: UserFilters = {
  search: '',
  status: 'All',
  role: 'All',
  sortBy: 'id',
  sortOrder: 'asc'
};

export function useUsers() {
  const { showToast } = useToast();

  const [rawUsers, setRawUsers] = useState<User[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMutating, setIsMutating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<UserFilters>(DEFAULT_FILTERS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Pagination state
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  // Fetch users from backend
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Backend fetch
      const res = await userApi.getUsers();
      setRawUsers(res.users);
    } catch (err: any) {
      const message = err.message || 'Failed to fetch user dataset from backend';
      setError(message);
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  // Initial mount load
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Reset page to 1 whenever search, status, or role filter changes
  useEffect(() => {
    setPage(1);
  }, [filters.search, filters.status, filters.role]);

  // Filter and sort users locally for immediate responsiveness
  const filteredUsers = useMemo(() => {
    let result = [...rawUsers];

    // Search query filter
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q) ||
          u.id.includes(q)
      );
    }

    // Status filter
    if (filters.status !== 'All') {
      result = result.filter((u) => u.status === filters.status);
    }

    // Role filter
    if (filters.role !== 'All') {
      result = result.filter((u) => u.role === filters.role);
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case 'id': {
          const numA = parseInt(a.id, 10);
          const numB = parseInt(b.id, 10);
          comparison = !isNaN(numA) && !isNaN(numB) ? numA - numB : a.id.localeCompare(b.id);
          break;
        }
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'email':
          comparison = a.email.localeCompare(b.email);
          break;
        case 'role':
          comparison = a.role.localeCompare(b.role);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [rawUsers, filters]);

  // Recalculate stats dynamically based on current raw users
  const currentStats = useMemo<UserStats>(() => {
    return {
      total: rawUsers.length,
      active: rawUsers.filter((u) => u.status === 'Active').length,
      inactive: rawUsers.filter((u) => u.status === 'Inactive').length
    };
  }, [rawUsers]);

  // Extract unique roles dynamically from the user dataset
  const availableRoles = useMemo(() => {
    const roles = new Set(rawUsers.map((u) => u.role).filter(Boolean));
    return Array.from(roles).sort();
  }, [rawUsers]);

  // Paginated subset of filtered users
  const totalFiltered = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  // Filter setters
  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const setStatusFilter = useCallback((status: 'All' | UserStatus) => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const setRoleFilter = useCallback((role: 'All' | UserRole) => {
    setFilters((prev) => ({ ...prev, role }));
  }, []);

  const setSorting = useCallback((sortBy: SortField, sortOrder?: SortOrder) => {
    setFilters((prev) => ({
      ...prev,
      sortBy,
      sortOrder: sortOrder || (prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc')
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.search !== '' ||
      filters.status !== 'All' ||
      filters.role !== 'All' ||
      filters.sortBy !== DEFAULT_FILTERS.sortBy ||
      filters.sortOrder !== DEFAULT_FILTERS.sortOrder
    );
  }, [filters]);

  // Selection handlers
  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    const visibleIds = paginatedUsers.map((u) => u.id);
    setSelectedIds((prev) => {
      const allSelected = visibleIds.every((id) => prev.has(id));
      const next = new Set(prev);
      if (allSelected) {
        visibleIds.forEach((id) => next.delete(id));
      } else {
        visibleIds.forEach((id) => next.add(id));
      }
      return next;
    });
  }, [paginatedUsers]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const isAllSelected = useMemo(() => {
    if (paginatedUsers.length === 0) return false;
    return paginatedUsers.every((u) => selectedIds.has(u.id));
  }, [paginatedUsers, selectedIds]);

  // Status update mutation (with optimistic update and rollback)
  const updateStatus = useCallback(
    async (userId: string, newStatus: UserStatus) => {
      const previousUsers = [...rawUsers];
      const targetUser = rawUsers.find((u) => u.id === userId);
      if (!targetUser) return;

      if (targetUser.status === newStatus) return;

      // Optimistic update
      setRawUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, status: newStatus }
            : u
        )
      );

      setIsMutating(true);
      try {
        const res = await userApi.updateStatus(userId, newStatus);
        showToast(res.message || `Updated ${targetUser.name}'s status to ${newStatus}`, 'success');
      } catch (err: any) {
        // Rollback
        setRawUsers(previousUsers);
        const msg = err.message || 'Failed to update user status on server';
        showToast(msg, 'error');
      } finally {
        setIsMutating(false);
      }
    },
    [rawUsers, showToast]
  );

  // Bulk status update mutation
  const bulkUpdateStatus = useCallback(
    async (newStatus: UserStatus) => {
      const userIds = Array.from(selectedIds);
      if (userIds.length === 0) return;

      const previousUsers = [...rawUsers];

      // Optimistic update
      setRawUsers((prev) =>
        prev.map((u) => (userIds.includes(u.id) ? { ...u, status: newStatus } : u))
      );

      setIsMutating(true);
      try {
        const res = await userApi.bulkUpdateStatus(userIds, newStatus);
        showToast(res.message || `Updated ${userIds.length} users to ${newStatus}`, 'success');
        clearSelection();
      } catch (err: any) {
        setRawUsers(previousUsers);
        showToast(err.message || 'Failed to execute bulk update', 'error');
      } finally {
        setIsMutating(false);
      }
    },
    [selectedIds, rawUsers, showToast, clearSelection]
  );

  // Create user
  const createUser = useCallback(
    async (input: CreateUserInput) => {
      setIsMutating(true);
      try {
        const res = await userApi.createUser(input);
        setRawUsers((prev) => [res.user, ...prev]);
        showToast(`Created account for ${res.user.name}`, 'success');
        return true;
      } catch (err: any) {
        showToast(err.message || 'Failed to create user', 'error');
        return false;
      } finally {
        setIsMutating(false);
      }
    },
    [showToast]
  );

  // Update full user details
  const updateUser = useCallback(
    async (userId: string, input: UpdateUserInput) => {
      setIsMutating(true);
      try {
        const res = await userApi.updateUser(userId, input);
        setRawUsers((prev) => prev.map((u) => (u.id === userId ? res.user : u)));
        showToast(`User ${res.user.name} updated successfully`, 'success');
        return true;
      } catch (err: any) {
        showToast(err.message || 'Failed to update user', 'error');
        return false;
      } finally {
        setIsMutating(false);
      }
    },
    [showToast]
  );

  // Delete user
  const deleteUser = useCallback(
    async (userId: string) => {
      const user = rawUsers.find((u) => u.id === userId);
      setIsMutating(true);
      try {
        await userApi.deleteUser(userId);
        setRawUsers((prev) => prev.filter((u) => u.id !== userId));
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(userId);
          return next;
        });
        showToast(user ? `Removed ${user.name}` : 'User deleted', 'info');
        return true;
      } catch (err: any) {
        showToast(err.message || 'Failed to delete user', 'error');
        return false;
      } finally {
        setIsMutating(false);
      }
    },
    [rawUsers, showToast]
  );

  // Reset database back to default seed data
  const resetToDemo = useCallback(async () => {
    setIsLoading(true);
    try {
      await userApi.resetDatabase();
      await fetchUsers();
      clearSelection();
      resetFilters();
      showToast('Database reset to original demonstration dataset', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to reset database', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [fetchUsers, clearSelection, resetFilters, showToast]);

  return {
    users: paginatedUsers,
    allFilteredUsers: filteredUsers,
    rawUsers,
    availableRoles,
    stats: currentStats,
    isLoading,
    isMutating,
    error,
    filters,
    hasActiveFilters,
    setSearch,
    setStatusFilter,
    setRoleFilter,
    setSorting,
    resetFilters,
    selectedIds,
    toggleSelect,
    selectAll,
    clearSelection,
    isAllSelected,
    updateStatus,
    bulkUpdateStatus,
    createUser,
    updateUser,
    deleteUser,
    resetToDemo,
    refetch: fetchUsers,
    pagination: {
      page: currentPage,
      pageSize,
      totalPages,
      totalItems: totalFiltered,
      setPage,
      setPageSize
    }
  };
}
