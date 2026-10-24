import { test } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createDemoServer } from './demo-api.mjs';

async function fixture(t) {
  const server = createDemoServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise((resolve, reject) => {
    server.close(error => error ? reject(error) : resolve());
  }));
  const address = server.address();
  return { base: 'http://127.0.0.1:' + address.port };
}
async function signIn(base) {
  const login = await fetch(base + '/api/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'demo@example.test', password: 'demo12345' }),
  });
  assert.equal(login.status, 200);
  const cookies = login.headers.getSetCookie().map(line => line.split(';')[0]);
  const jar = cookies.join('; ');
  const xsrf = cookies.find(cookie => cookie.startsWith('XSRF-TOKEN='))?.slice('XSRF-TOKEN='.length);
  assert.ok(xsrf);
  return { jar, xsrf };
}
function authHeaders(auth, extra = {}) {
  return { Cookie: auth.jar, 'X-XSRF-TOKEN': auth.xsrf, ...extra };
}

test('an unauthenticated demo session gets 401, not a fake production identity', async t => {
  const { base } = await fixture(t);
  const response = await fetch(base + '/api/session');
  assert.equal(response.status, 401);
  assert.equal((await response.json()).code, 'UNAUTHENTICATED');
});

test('demo login, session restoration and logout are usable', async t => {
  const { base } = await fixture(t);
  const wrong = await fetch(base + '/api/session', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'demo@example.test', password: 'incorrect' }),
  });
  assert.equal(wrong.status, 401);
  const auth = await signIn(base);
  const session = await fetch(base + '/api/session', { headers: { Cookie: auth.jar } });
  assert.equal(session.status, 200);
  assert.ok((await session.json()).permissions.includes('customers:create'));
  const logout = await fetch(base + '/api/session', {
    method: 'DELETE', headers: authHeaders(auth),
  });
  assert.equal(logout.status, 204);
  const expired = await fetch(base + '/api/session', { headers: { Cookie: auth.jar } });
  assert.equal(expired.status, 401);
});

test('demo cursor, search, local CSRF and CRUD use the reference API envelope', async t => {
  const { base } = await fixture(t);
  const auth = await signIn(base);
  const list = await fetch(base + '/api/customers?limit=10', { headers: { Cookie: auth.jar } });
  assert.equal(list.status, 200);
  const first = await list.json();
  assert.equal(first.items.length, 10);
  assert.equal(typeof first.nextCursor, 'string');
  const next = await fetch(base + '/api/customers?limit=10&cursor=' + encodeURIComponent(first.nextCursor),
    { headers: { Cookie: auth.jar } });
  assert.equal(next.status, 200);
  const second = await next.json();
  assert.notEqual(second.items[0].id, first.items[0].id);
  const invalid = await fetch(base + '/api/customers?limit=10&search=other&cursor=' +
    encodeURIComponent(first.nextCursor), { headers: { Cookie: auth.jar } });
  assert.equal(invalid.status, 400);

  const input = { name: 'Sample Person', email: 'sample.person@example.test', status: 'active' };
  const noCsrf = await fetch(base + '/api/customers', {
    method: 'POST', headers: { ...authHeaders(auth), 'X-XSRF-TOKEN': '', 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  assert.equal(noCsrf.status, 403);
  const create = await fetch(base + '/api/customers', {
    method: 'POST', headers: authHeaders(auth, { 'Content-Type': 'application/json' }),
    body: JSON.stringify(input),
  });
  assert.equal(create.status, 201);
  const created = await create.json();
  assert.equal(created.email, input.email);
  const update = await fetch(base + '/api/customers/' + created.id, {
    method: 'PATCH', headers: authHeaders(auth, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({ ...input, status: 'inactive' }),
  });
  assert.equal(update.status, 200);
  assert.equal((await update.json()).status, 'inactive');
  const search = await fetch(base + '/api/customers?search=sample.person',
    { headers: { Cookie: auth.jar } });
  assert.equal((await search.json()).items.length, 1);
  const remove = await fetch(base + '/api/customers/' + created.id, {
    method: 'DELETE', headers: authHeaders(auth),
  });
  assert.equal(remove.status, 204);
  const deleted = await fetch(base + '/api/customers/' + created.id, { headers: { Cookie: auth.jar } });
  assert.equal(deleted.status, 404);
});

test('rejects foreign Origin headers and accepts localhost browser requests', async t => {
  const { base } = await fixture(t);
  const denied = await fetch(base + '/api/session', {
    headers: { Origin: 'https://untrusted.example' },
  });
  assert.equal(denied.status, 403);
  assert.equal((await denied.json()).code, 'DEMO_LOCAL_ONLY');
  const accepted = await fetch(base + '/api/session', {
    headers: { Origin: 'http://localhost:4200' },
  });
  assert.equal(accepted.status, 401); // Local browser, no session.
});
