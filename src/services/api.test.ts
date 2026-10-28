import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userApi, API_BASE_URL, normalizeUser, ApiError } from './api';

describe('userApi client with MockAPI integration', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('normalizes raw MockAPI user correctly', () => {
    const raw = {
      id: '1',
      name: 'Keegan',
      email: 'Thalia91@yahoo.com',
      role: 'Senior Mobility Orchestrator',
      status: 'active'
    };

    const user = normalizeUser(raw);
    expect(user.id).toBe('1');
    expect(user.name).toBe('Keegan');
    expect(user.status).toBe('Active'); // Normalizes lowercase 'active' -> 'Active'
    expect(user.role).toBe('Senior Mobility Orchestrator');
  });

  it('fetches users list from MockAPI endpoint', async () => {
    const mockList = [
      { id: '1', name: 'Keegan', email: 'Thalia91@yahoo.com', role: 'Senior Mobility Orchestrator', status: 'Active' },
      { id: '2', name: 'Kurt', email: 'Abe.Crona48@yahoo.com', role: 'Chief Quality Representative', status: 'Inactive' }
    ];

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockList
    } as Response);

    const result = await userApi.getUsers();

    expect(fetchSpy).toHaveBeenCalledWith(API_BASE_URL);
    expect(result.users).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.stats.active).toBe(1);
    expect(result.stats.inactive).toBe(1);
  });

  it('updates user status in MockAPI via PUT', async () => {
    const mockUpdated = {
      id: '1',
      name: 'Keegan',
      email: 'Thalia91@yahoo.com',
      role: 'Senior Mobility Orchestrator',
      status: 'Inactive'
    };

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockUpdated
    } as Response);

    const result = await userApi.updateStatus('1', 'Inactive');

    expect(fetchSpy).toHaveBeenCalledWith(`${API_BASE_URL}/1`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Inactive' })
    });
    expect(result.user.status).toBe('Inactive');
    expect(result.message).toContain('Keegan');
  });

  it('bulk updates user statuses in MockAPI via parallel PUT requests', async () => {
    const mockUpdated1 = { id: '1', name: 'Keegan', status: 'Active' };
    const mockUpdated2 = { id: '2', name: 'Kurt', status: 'Active' };

    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUpdated1
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUpdated2
      } as Response);

    const result = await userApi.bulkUpdateStatus(['1', '2'], 'Active');

    expect(result.updatedCount).toBe(2);
    expect(result.status).toBe('Active');
  });

  it('throws ApiError with error message when MockAPI request fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: 'User not found' })
    } as Response);

    await expect(userApi.updateStatus('999', 'Active')).rejects.toThrow(ApiError);
  });
});
