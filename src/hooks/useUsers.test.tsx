import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useUsers } from './useUsers';
import { ToastProvider } from '../context/ToastContext';
import { userApi } from '../services/api';
import { User } from '../types/user';
import React from 'react';

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Connor',
    email: 'sarah@acme.inc',
    role: 'Admin',
    status: 'Active'
  },
  {
    id: '2',
    name: 'Marcus Vance',
    email: 'marcus@acme.inc',
    role: 'Developer',
    status: 'Inactive'
  },
  {
    id: '3',
    name: 'Elena Rostova',
    email: 'elena@acme.inc',
    role: 'Manager',
    status: 'Active'
  }
];

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ToastProvider>{children}</ToastProvider>
);

describe('useUsers hook', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(userApi, 'getUsers').mockResolvedValue({
      users: mockUsers,
      total: mockUsers.length,
      stats: { total: 3, active: 2, inactive: 1 }
    });
  });

  it('loads users and statistics on initial mount', async () => {
    const { result } = renderHook(() => useUsers(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.rawUsers).toHaveLength(3);
    expect(result.current.stats.total).toBe(3);
    expect(result.current.stats.active).toBe(2);
    expect(result.current.stats.inactive).toBe(1);
  });

  it('filters users by search query', async () => {
    const { result } = renderHook(() => useUsers(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setSearch('Sarah');
    });

    expect(result.current.users).toHaveLength(1);
    expect(result.current.users[0].name).toBe('Sarah Connor');
  });

  it('filters users by status', async () => {
    const { result } = renderHook(() => useUsers(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setStatusFilter('Inactive');
    });

    expect(result.current.users).toHaveLength(1);
    expect(result.current.users[0].name).toBe('Marcus Vance');
  });

  it('filters users by role', async () => {
    const { result } = renderHook(() => useUsers(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setRoleFilter('Manager');
    });

    expect(result.current.users).toHaveLength(1);
    expect(result.current.users[0].name).toBe('Elena Rostova');
  });

  it('handles row selection and selectAll toggle', async () => {
    const { result } = renderHook(() => useUsers(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.toggleSelect('1');
    });

    expect(result.current.selectedIds.has('1')).toBe(true);

    act(() => {
      result.current.selectAll();
    });

    expect(result.current.isAllSelected).toBe(true);

    act(() => {
      result.current.clearSelection();
    });

    expect(result.current.selectedIds.size).toBe(0);
  });

  it('updates user status with optimistic state update', async () => {
    const updateSpy = vi.spyOn(userApi, 'updateStatus').mockResolvedValueOnce({
      user: { ...mockUsers[0], status: 'Inactive' },
      message: 'Status updated'
    });

    const { result } = renderHook(() => useUsers(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.updateStatus('1', 'Inactive');
    });

    expect(updateSpy).toHaveBeenCalledWith('1', 'Inactive');
    const updated = result.current.rawUsers.find((u) => u.id === '1');
    expect(updated?.status).toBe('Inactive');
  });

  it('computes available unique roles from loaded dataset', async () => {
    const { result } = renderHook(() => useUsers(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.availableRoles).toEqual(['Admin', 'Developer', 'Manager']);
  });
});
