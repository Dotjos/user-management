import { describe, it, expect, beforeEach } from 'vitest';
import { handleApiRequest, resetTestDb, getDb } from './apiHandler';
import { EventEmitter } from 'events';
import { IncomingMessage, ServerResponse } from 'http';

function createMockReq(url: string, method: string, body?: any): IncomingMessage {
  const req = new EventEmitter() as any;
  req.url = url;
  req.method = method;
  req.headers = { 'content-type': 'application/json' };

  process.nextTick(() => {
    if (body) {
      req.emit('data', Buffer.from(JSON.stringify(body)));
    }
    req.emit('end');
  });

  return req;
}

function createMockRes(): { res: ServerResponse; getResult: () => Promise<{ statusCode: number; data: any }> } {
  const res = new EventEmitter() as any;
  res.statusCode = 200;
  res.headers = {};
  res.setHeader = (key: string, val: string) => {
    res.headers[key] = val;
  };

  let body = '';
  const promise = new Promise<{ statusCode: number; data: any }>((resolve) => {
    res.end = (chunk?: any) => {
      if (chunk) body += chunk.toString();
      let parsed = null;
      try {
        parsed = body ? JSON.parse(body) : null;
      } catch {
        parsed = body;
      }
      resolve({ statusCode: res.statusCode, data: parsed });
    };
  });

  return { res, getResult: () => promise };
}

describe('Backend API Handler', () => {
  beforeEach(() => {
    resetTestDb();
  });

  it('GET /api/users returns initial dataset and stats', async () => {
    const req = createMockReq('/api/users', 'GET');
    const { res, getResult } = createMockRes();

    const handled = await handleApiRequest(req, res);
    expect(handled).toBe(true);

    const { statusCode, data } = await getResult();
    expect(statusCode).toBe(200);
    expect(data.success).toBe(true);
    expect(data.users.length).toBeGreaterThan(0);
    expect(data.stats.total).toBe(data.users.length);
  });

  it('GET /api/users filters by status and search query', async () => {
    const req = createMockReq('/api/users?status=Inactive&search=liam', 'GET');
    const { res, getResult } = createMockRes();

    await handleApiRequest(req, res);
    const { statusCode, data } = await getResult();

    expect(statusCode).toBe(200);
    expect(data.users.length).toBe(1);
    expect(data.users[0].name).toBe('Liam Gallagher');
    expect(data.users[0].status).toBe('Inactive');
  });

  it('PATCH /api/users/:id/status updates status in the database', async () => {
    const req = createMockReq('/api/users/1/status', 'PATCH', { status: 'Inactive' });
    const { res, getResult } = createMockRes();

    await handleApiRequest(req, res);
    const { statusCode, data } = await getResult();

    expect(statusCode).toBe(200);
    expect(data.success).toBe(true);
    expect(data.user.status).toBe('Inactive');

    // Verify database state updated
    const db = getDb();
    const updated = db.find((u) => u.id === '1');
    expect(updated?.status).toBe('Inactive');
  });

  it('POST /api/users/bulk-status updates multiple users simultaneously', async () => {
    const req = createMockReq('/api/users/bulk-status', 'POST', {
      userIds: ['1', '2'],
      status: 'Inactive'
    });
    const { res, getResult } = createMockRes();

    await handleApiRequest(req, res);
    const { statusCode, data } = await getResult();

    expect(statusCode).toBe(200);
    expect(data.success).toBe(true);
    expect(data.updatedCount).toBe(2);

    const db = getDb();
    expect(db.find((u) => u.id === '1')?.status).toBe('Inactive');
    expect(db.find((u) => u.id === '2')?.status).toBe('Inactive');
  });

  it('POST /api/users creates a new user', async () => {
    const newUserInput = {
      name: 'Grace Hopper',
      email: 'grace@acme.inc',
      role: 'Admin',
      status: 'Active'
    };
    const req = createMockReq('/api/users', 'POST', newUserInput);
    const { res, getResult } = createMockRes();

    await handleApiRequest(req, res);
    const { statusCode, data } = await getResult();

    expect(statusCode).toBe(201);
    expect(data.success).toBe(true);
    expect(data.user.name).toBe('Grace Hopper');
    expect(data.user.id).toBeDefined();

    const db = getDb();
    expect(db.some((u) => u.name === 'Grace Hopper')).toBe(true);
  });

  it('DELETE /api/users/:id removes a user', async () => {
    const req = createMockReq('/api/users/1', 'DELETE');
    const { res, getResult } = createMockRes();

    await handleApiRequest(req, res);
    const { statusCode, data } = await getResult();

    expect(statusCode).toBe(200);
    expect(data.success).toBe(true);

    const db = getDb();
    expect(db.some((u) => u.id === '1')).toBe(false);
  });

  it('POST /api/reset resets database to initial seed dataset', async () => {
    // Delete one user first
    const delReq = createMockReq('/api/users/1', 'DELETE');
    const { res: delRes } = createMockRes();
    await handleApiRequest(delReq, delRes);

    // Now reset
    const resetReq = createMockReq('/api/reset', 'POST');
    const { res, getResult } = createMockRes();
    await handleApiRequest(resetReq, res);
    const { statusCode, data } = await getResult();

    expect(statusCode).toBe(200);
    expect(data.count).toBe(14);
    const db = getDb();
    expect(db.some((u) => u.id === '1')).toBe(true);
  });
});
