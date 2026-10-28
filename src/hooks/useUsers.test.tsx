import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useUsers } from './useUsers';
import { ToastProvider } from '../context/ToastContext';
import { userApi } from '../services/api';
import { User } from '../types/user';
import React from 'react';

const mockUsers: User[] = [
  {
    id: 'usr_1',
    name: 'Sarah Connor',
    email: 'sarah@acme.inc',
    role: 'Admin',
    status: 'Active',
    avatarUrl: 'https://example.com/sarah.jpg',
    department: 'Engineering',
    location: 'San Francisco, CA',
    createdAt: '2023-01-01T00:00:00Z',
    lastActiveAt: '2026-10-28T10:00:00Z'
  },
  {
    id: 'usr_2',
    name: 'Marcus Vance',
    email: 'marcus@acme.inc',
    role: 'Developer',
    status: 'Suspended',
    avatarUrl: 'https://example.com/marcus.jpg',
    department: 'Engineering',
    location: 'Austin, TX',
    createdAt: '2023-02-01T00:00:00Z',
    lastActiveAt: '2026-10-28T09:00:00Z'
  },
  {
    id: 'usr_3',
    name: 'Elena Rostova',
    email: 'elena@acme.inc',
    role: 'Manager',
    status: 'Pending',
    avatarUrl: 'https://example.com/elena.jpg',
    department: 'Product',
    location: 'Seattle, WA',
    createdAt: '2023-03-01T00:00:00Z',
    lastActiveAt: '2026-10-28T08:00:00Z'
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
      stats: { total: 3, active: 1, pending: 1, suspended: 1, inactive: 0 }
    });
  });

  it('loads users and statistics on initial mount', async () => {
    const { result } = renderHook(() => useUsers(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.rawUsers).toHaveLength(3);
    expect(result.current.stats.total).toBe(3);
    expect(result.current.stats.active).toBe(1);
    expect(result.current.stats.suspended).toBe(1);
    expect(result.current.stats.pending).toBe(1);
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
      result.current.setStatusFilter('Suspended');
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
      result.current.toggleSelect('usr_1');
    });

    expect(result.current.selectedIds.has('usr_1')).toBe(true);

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
      user: { ...mockUsers[0], status: 'Suspended' },
      message: 'Status updated'
    });

    const { result } = renderHook(() => useUsers(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.updateStatus('usr_1', 'Suspended');
    });

    expect(updateSpy).toHaveBeenCalledWith('usr_1', 'Suspended');
    const updated = result.current.rawUsers.find((u) => u.id === 'usr_1');
    expect(updated?.status).toBe('Suspended');
  });
});
