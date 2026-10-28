import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userApi, ApiError } from './api';
import { User } from '../types/user';

const mockUser: User = {
  id: 'usr_test1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'Developer',
  status: 'Active',
  avatarUrl: 'https://example.com/avatar.jpg',
  department: 'Engineering',
  location: 'Remote',
  createdAt: '2023-01-01T00:00:00Z',
  lastActiveAt: '2026-10-28T00:00:00Z',
  notes: 'Test note'
};

describe('userApi client', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches users list with search and filter query params', async () => {
    const mockResponse = {
      success: true,
      users: [mockUser],
      total: 1,
      stats: { total: 1, active: 1, pending: 0, suspended: 0, inactive: 0 }
    };

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    } as Response);

    const result = await userApi.getUsers({ search: 'test', status: 'Active', role: 'Developer' });

    expect(fetchSpy).toHaveBeenCalledWith('/api/users?search=test&status=Active&role=Developer');
    expect(result.users).toHaveLength(1);
    expect(result.users[0].name).toBe('Test User');
  });

  it('updates user status via PATCH /api/users/:id/status', async () => {
    const updatedUser = { ...mockUser, status: 'Suspended' as const };
    const mockResponse = {
      success: true,
      user: updatedUser,
      message: 'Status updated to Suspended'
    };

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    } as Response);

    const result = await userApi.updateStatus('usr_test1', 'Suspended');

    expect(fetchSpy).toHaveBeenCalledWith('/api/users/usr_test1/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Suspended' })
    });
    expect(result.user.status).toBe('Suspended');
    expect(result.message).toBe('Status updated to Suspended');
  });

  it('bulk updates user statuses via POST /api/users/bulk-status', async () => {
    const mockResponse = {
      success: true,
      updatedCount: 2,
      status: 'Active',
      message: 'Successfully updated 2 users'
    };

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    } as Response);

    const result = await userApi.bulkUpdateStatus(['usr_1', 'usr_2'], 'Active');

    expect(fetchSpy).toHaveBeenCalledWith('/api/users/bulk-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userIds: ['usr_1', 'usr_2'], status: 'Active' })
    });
    expect(result.updatedCount).toBe(2);
  });

  it('throws ApiError with server error message when request fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: 'Invalid status specified' })
    } as Response);

    await expect(userApi.updateStatus('usr_1', 'Invalid' as any)).rejects.toThrow(ApiError);
  });
});
