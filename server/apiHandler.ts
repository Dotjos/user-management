import { IncomingMessage, ServerResponse } from 'http';
import { User, UserStatus } from '../src/types/user';

export const INITIAL_USERS: User[] = [
  { id: '1', name: 'Sarah Connor', email: 'sarah.connor@acme.inc', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Marcus Vance', email: 'marcus.vance@acme.inc', role: 'Developer', status: 'Active' },
  { id: '3', name: 'Elena Rostova', email: 'elena.rostova@acme.inc', role: 'Manager', status: 'Active' },
  { id: '4', name: 'Devon Lee', email: 'devon.lee@acme.inc', role: 'Designer', status: 'Inactive' },
  { id: '5', name: 'Aisha Al-Mansoor', email: 'aisha.m@acme.inc', role: 'Admin', status: 'Active' },
  { id: '6', name: 'Liam Gallagher', email: 'liam.g@acme.inc', role: 'Support', status: 'Inactive' },
  { id: '7', name: 'Chao Zhang', email: 'chao.zhang@acme.inc', role: 'Developer', status: 'Active' },
  { id: '8', name: 'Chloe Bennett', email: 'chloe.bennett@acme.inc', role: 'Designer', status: 'Active' },
  { id: '9', name: 'Mateo Morales', email: 'mateo.morales@acme.inc', role: 'Developer', status: 'Inactive' },
  { id: '10', name: 'Rachel Green', email: 'rachel.g@acme.inc', role: 'Support', status: 'Inactive' },
  { id: '11', name: 'Hiroshi Tanaka', email: 'hiroshi.t@acme.inc', role: 'Manager', status: 'Active' },
  { id: '12', name: 'Zoe Kravitz', email: 'zoe.kravitz@acme.inc', role: 'Support', status: 'Inactive' },
  { id: '13', name: 'Kofi Mensah', email: 'kofi.mensah@acme.inc', role: 'Developer', status: 'Active' },
  { id: '14', name: 'Hannah Schmidt', email: 'hannah.s@acme.inc', role: 'Manager', status: 'Inactive' }
];

// In-memory backend database state
let usersDb: User[] = JSON.parse(JSON.stringify(INITIAL_USERS));

const VALID_STATUSES: UserStatus[] = ['Active', 'Inactive'];

// Helper to parse JSON body
function parseRequestBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(new Error('Invalid JSON format in request body'));
      }
    });
    req.on('error', reject);
  });
}

// Helper to send JSON response
function sendJson(res: ServerResponse, statusCode: number, data: any) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(data));
}

export async function handleApiRequest(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const url = new URL(req.url || '', 'http://localhost');
  const pathname = url.pathname;
  const method = req.method?.toUpperCase();

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.end();
    return true;
  }

  // Only handle /api/* routes
  if (!pathname.startsWith('/api')) {
    return false;
  }

  try {
    // GET /api/users
    if (pathname === '/api/users' && method === 'GET') {
      const search = url.searchParams.get('search')?.toLowerCase() || '';
      const status = url.searchParams.get('status') || 'All';
      const role = url.searchParams.get('role') || 'All';

      let filtered = [...usersDb];

      if (search) {
        filtered = filtered.filter(u =>
          u.name.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search) ||
          u.role.toLowerCase().includes(search)
        );
      }

      if (status !== 'All') {
        filtered = filtered.filter(u => u.status === status);
      }

      if (role !== 'All') {
        filtered = filtered.filter(u => u.role === role);
      }

      const stats = {
        total: usersDb.length,
        active: usersDb.filter(u => u.status === 'Active').length,
        inactive: usersDb.filter(u => u.status === 'Inactive').length,
      };

      sendJson(res, 200, {
        success: true,
        users: filtered,
        total: filtered.length,
        stats
      });
      return true;
    }

    // POST /api/users/bulk-status
    if (pathname === '/api/users/bulk-status' && method === 'POST') {
      const body = await parseRequestBody(req);
      const { userIds, status } = body;

      if (!Array.isArray(userIds) || userIds.length === 0) {
        sendJson(res, 400, { success: false, error: 'userIds must be a non-empty array' });
        return true;
      }

      if (!VALID_STATUSES.includes(status)) {
        sendJson(res, 400, { success: false, error: `Invalid status "${status}". Must be one of: ${VALID_STATUSES.join(', ')}` });
        return true;
      }

      let updatedCount = 0;
      usersDb = usersDb.map(u => {
        if (userIds.includes(u.id)) {
          updatedCount++;
          return { ...u, status };
        }
        return u;
      });

      sendJson(res, 200, {
        success: true,
        updatedCount,
        status,
        message: `Successfully updated ${updatedCount} users to ${status}`
      });
      return true;
    }

    // PATCH /api/users/:id/status
    const statusMatch = pathname.match(/^\/api\/users\/([^/]+)\/status$/);
    if (statusMatch && method === 'PATCH') {
      const userId = statusMatch[1];
      const body = await parseRequestBody(req);
      const { status } = body;

      if (!VALID_STATUSES.includes(status)) {
        sendJson(res, 400, {
          success: false,
          error: `Invalid status "${status}". Allowed values: ${VALID_STATUSES.join(', ')}`
        });
        return true;
      }

      const index = usersDb.findIndex(u => u.id === userId);
      if (index === -1) {
        sendJson(res, 404, { success: false, error: `User with id "${userId}" not found` });
        return true;
      }

      usersDb[index] = {
        ...usersDb[index],
        status
      };

      sendJson(res, 200, {
        success: true,
        user: usersDb[index],
        message: `Status updated to ${status} for ${usersDb[index].name}`
      });
      return true;
    }

    // GET /api/users/:id
    const userMatch = pathname.match(/^\/api\/users\/([^/]+)$/);
    if (userMatch && method === 'GET') {
      const userId = userMatch[1];
      const user = usersDb.find(u => u.id === userId);
      if (!user) {
        sendJson(res, 404, { success: false, error: `User with id "${userId}" not found` });
        return true;
      }
      sendJson(res, 200, { success: true, user });
      return true;
    }

    // PUT /api/users/:id
    if (userMatch && method === 'PUT') {
      const userId = userMatch[1];
      const body = await parseRequestBody(req);
      const index = usersDb.findIndex(u => u.id === userId);
      if (index === -1) {
        sendJson(res, 404, { success: false, error: `User with id "${userId}" not found` });
        return true;
      }

      if (body.status && !VALID_STATUSES.includes(body.status)) {
        sendJson(res, 400, { success: false, error: `Invalid status "${body.status}"` });
        return true;
      }

      usersDb[index] = {
        ...usersDb[index],
        ...body,
        id: userId // Ensure ID is immutable
      };

      sendJson(res, 200, {
        success: true,
        user: usersDb[index],
        message: `User ${usersDb[index].name} updated successfully`
      });
      return true;
    }

    // DELETE /api/users/:id
    if (userMatch && method === 'DELETE') {
      const userId = userMatch[1];
      const index = usersDb.findIndex(u => u.id === userId);
      if (index === -1) {
        sendJson(res, 404, { success: false, error: `User with id "${userId}" not found` });
        return true;
      }

      const deleted = usersDb[index];
      usersDb.splice(index, 1);
      sendJson(res, 200, {
        success: true,
        id: userId,
        message: `User ${deleted.name} was removed`
      });
      return true;
    }

    // POST /api/users (Create User)
    if (pathname === '/api/users' && method === 'POST') {
      const body = await parseRequestBody(req);
      const { name, email, role, status = 'Active' } = body;

      if (!name || !email) {
        sendJson(res, 400, { success: false, error: 'Name and email are required fields' });
        return true;
      }

      const newUser: User = {
        id: `${Date.now().toString(36)}`,
        name,
        email,
        role: role || 'Developer',
        status: VALID_STATUSES.includes(status) ? status : 'Active',
      };

      usersDb.unshift(newUser);
      sendJson(res, 201, {
        success: true,
        user: newUser,
        message: `User ${newUser.name} created successfully`
      });
      return true;
    }

    // POST /api/reset
    if (pathname === '/api/reset' && method === 'POST') {
      usersDb = JSON.parse(JSON.stringify(INITIAL_USERS));
      sendJson(res, 200, {
        success: true,
        message: 'Database reset to initial demo dataset',
        count: usersDb.length
      });
      return true;
    }

    // Not found API route
    sendJson(res, 404, { success: false, error: `API route ${method} ${pathname} not found` });
    return true;
  } catch (error: any) {
    sendJson(res, 500, { success: false, error: error.message || 'Internal Server Error' });
    return true;
  }
}

// Function to reset database (useful for tests)
export function resetTestDb() {
  usersDb = JSON.parse(JSON.stringify(INITIAL_USERS));
}

// Function to get current db (useful for tests)
export function getDb() {
  return usersDb;
}
