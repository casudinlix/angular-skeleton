/**
 * Local-only, ephemeral reference API. Deliberately NOT a production backend.
 * Binds 127.0.0.1, contains synthetic records and is never bundled in Angular.
 */
import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const ACCOUNT = Object.freeze({ email: 'demo@example.test', password: 'demo12345' });
const PERMISSIONS = ['customers:read', 'customers:create', 'customers:update', 'customers:delete'];
const SEED = Array.from({ length: 36 }, (_, index) => {
  const n = index + 1;
  return {
    id: 'demo-' + String(n).padStart(4, '0'),
    name: 'Contoh Pelanggan ' + String(n).padStart(2, '0'),
    email: 'pelanggan' + n + '@example.test',
    status: n % 5 === 0 ? 'inactive' : 'active',
  };
});
const MAX_BODY = 16 * 1024;

export function createDemoServer() {
  const customers = new Map(SEED.map(item => [item.id, { ...item }]));
  const sessions = new Map();
  const instanceId = process.env.DEMO_INSTANCE_KEY ?? '';
  let nextId = SEED.length;

  function json(res, status, value, additional = {}) {
    res.writeHead(status, {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      ...additional,
    });
    res.end(status === 204 ? undefined : JSON.stringify(value));
  }
  function failure(res, status, code, message) { json(res, status, { code, message }); }
  function cookies(req) {
    const result = Object.create(null);
    for (const entry of (req.headers.cookie ?? '').split(';')) {
      const separator = entry.indexOf('=');
      if (separator > 0) result[entry.slice(0, separator).trim()] = entry.slice(separator + 1).trim();
    }
    return result;
  }
  async function requestBody(req) {
    let size = 0;
    const chunks = [];
    for await (const chunk of req) {
      size += chunk.length;
      if (size > MAX_BODY) {
        const error = new Error('Payload too large');
        error.status = 413;
        throw error;
      }
      chunks.push(chunk);
    }
    try {
      const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'));
      if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) throw Error();
      return parsed;
    } catch {
      const error = new Error('Invalid JSON body');
      error.status = 400;
      throw error;
    }
  }
  function validCustomer(input) {
    if (typeof input.name !== 'string' || input.name.trim().length < 2 ||
        input.name.trim().length > 120 || typeof input.email !== 'string' ||
        input.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email) ||
        !['active', 'inactive'].includes(input.status)) return null;
    return { name: input.name.trim(), email: input.email.trim().toLowerCase(), status: input.status };
  }
  function cursorFor(after, search) {
    return Buffer.from(JSON.stringify({ after, search })).toString('base64url');
  }
  function parseCursor(raw, search) {
    if (!raw || raw.length > 2048) return null;
    try {
      const cursor = JSON.parse(Buffer.from(raw, 'base64url').toString('utf8'));
      if (!cursor || typeof cursor.after !== 'string' ||
          typeof cursor.search !== 'string' || cursor.search !== search) return null;
      return cursor.after;
    } catch { return null; }
  }
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? '/', 'http://127.0.0.1');
      const path = url.pathname;
      const method = req.method ?? 'GET';
      const jar = cookies(req);
      const session = sessions.get(jar.demo_session);
      if (path === '/_demo/health' && method === 'GET') {
        return json(res, 200, { mode: 'local-demo', status: 'ready', instanceId });
      }
      if (!path.startsWith('/api/')) return failure(res, 404, 'NOT_FOUND', 'Unknown endpoint');

      if (path === '/api/session' && method === 'POST') {
        const payload = await requestBody(req);
        if (payload.email !== ACCOUNT.email || payload.password !== ACCOUNT.password) {
          return failure(res, 401, 'INVALID_CREDENTIALS', 'Demo credentials are invalid');
        }
        const id = randomUUID();
        const xsrf = randomUUID();
        sessions.set(id, { xsrf, identity: {
          id: 'demo-operator', displayName: 'Demo Operator', permissions: PERMISSIONS,
        } });
        return json(res, 200, sessions.get(id).identity, {
          'Set-Cookie': [
            'demo_session=' + id + '; HttpOnly; SameSite=Lax; Path=/api',
            'XSRF-TOKEN=' + xsrf + '; SameSite=Lax; Path=/',
          ],
        });
      }
      if (!session) return failure(res, 401, 'UNAUTHENTICATED', 'Sign in using demo credentials');
      if (method !== 'GET' && method !== 'HEAD' && req.headers['x-xsrf-token'] !== session.xsrf) {
        return failure(res, 403, 'INVALID_CSRF', 'Missing demo CSRF token');
      }

      if (path === '/api/session') {
        if (method === 'GET') return json(res, 200, session.identity);
        if (method === 'DELETE') {
          sessions.delete(jar.demo_session);
          return json(res, 204, null, {
            'Set-Cookie': [
              'demo_session=; HttpOnly; SameSite=Lax; Path=/api; Max-Age=0',
              'XSRF-TOKEN=; SameSite=Lax; Path=/; Max-Age=0',
            ],
          });
        }
        return failure(res, 405, 'METHOD_NOT_ALLOWED', 'Method not allowed');
      }

      if (path === '/api/customers') {
        if (method === 'GET') {
          const search = (url.searchParams.get('search') ?? '').trim().toLowerCase();
          const requested = Number(url.searchParams.get('limit') ?? 20);
          if (!Number.isInteger(requested) || requested < 1 || requested > 100) {
            return failure(res, 400, 'INVALID_LIMIT', 'Limit must be between 1 and 100');
          }
          const matches = [...customers.values()]
            .filter(item => (item.name + ' ' + item.email).toLowerCase().includes(search))
            .sort((a, b) => a.id.localeCompare(b.id));
          const rawCursor = url.searchParams.get('cursor');
          let start = 0;
          if (rawCursor !== null) {
            const after = parseCursor(rawCursor, search);
            if (!after) return failure(res, 400, 'INVALID_CURSOR', 'Cursor does not match the filter');
            const index = matches.findIndex(item => item.id === after);
            if (index === -1) return failure(res, 410, 'CURSOR_EXPIRED', 'Cursor record no longer exists');
            start = index + 1;
          }
          const items = matches.slice(start, start + requested);
          const nextCursor = start + requested < matches.length
            ? cursorFor(items[items.length - 1].id, search) : null;
          return json(res, 200, { items, nextCursor });
        }
        if (method === 'POST') {
          const input = validCustomer(await requestBody(req));
          if (!input) return failure(res, 422, 'INVALID_CUSTOMER', 'Customer data is invalid');
          if ([...customers.values()].some(item => item.email === input.email)) {
            return failure(res, 409, 'DUPLICATE_EMAIL', 'Email already exists');
          }
          const item = { id: 'demo-' + String(++nextId).padStart(4, '0'), ...input };
          customers.set(item.id, item);
          return json(res, 201, item);
        }
        return failure(res, 405, 'METHOD_NOT_ALLOWED', 'Method not allowed');
      }

      const match = /^\/api\/customers\/([^/]+)$/.exec(path);
      if (!match) return failure(res, 404, 'NOT_FOUND', 'Unknown endpoint');
      const id = decodeURIComponent(match[1]);
      const item = customers.get(id);
      if (!item) return failure(res, 404, 'CUSTOMER_NOT_FOUND', 'Customer not found');
      if (method === 'GET') return json(res, 200, item);
      if (method === 'PATCH') {
        const input = validCustomer(await requestBody(req));
        if (!input) return failure(res, 422, 'INVALID_CUSTOMER', 'Customer data is invalid');
        if ([...customers.values()].some(other => other.id !== id && other.email === input.email)) {
          return failure(res, 409, 'DUPLICATE_EMAIL', 'Email already exists');
        }
        const updated = { id, ...input };
        customers.set(id, updated);
        return json(res, 200, updated);
      }
      if (method === 'DELETE') {
        customers.delete(id);
        return json(res, 204, null);
      }
      return failure(res, 405, 'METHOD_NOT_ALLOWED', 'Method not allowed');
    } catch (error) {
      const code = error.status === 413 ? 'PAYLOAD_TOO_LARGE' : 'BAD_REQUEST';
      failure(res, error.status === 413 ? 413 : 400, code, error.message === 'Payload too large'
        ? 'Request body too large' : 'Invalid demo API request');
    }
  });
  return server;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const port = Number(process.env.DEMO_API_PORT ?? '3000');
  const server = createDemoServer();
  server.on('error', error => {
    console.error('[demo-api]', error.code === 'EADDRINUSE'
      ? 'Port ' + port + ' is already in use. Stop the existing backend or use a different port.'
      : error.message);
    process.exitCode = 1;
  });
  server.listen(port, '127.0.0.1', () => {
    console.log('[demo-api] In-memory DEMO API at http://127.0.0.1:' + port);
    console.log('[demo-api] Credentials: demo@example.test / demo12345 (DEMO ONLY)');
  });
}
