# REST API contract for backend implementations

This is a **frontend contract**, not a server implementation. The reference Bun/Node/Go/Laravel backend must implement the following same-origin endpoints under `/api`.

## Sessions

| Method | Path | Input | Successful response |
|---|---|---|---|
| GET | `/api/session` | Cookie session | 200 Identity |
| POST | `/api/session` | `{ "email": "...", "password": "..." }` | 200 Identity + session cookies |
| DELETE | `/api/session` | Cookie session + CSRF | 204 |

Identity:
```json
{"id":"user-id","displayName":"Authenticated User","permissions":["customers:read","customers:create","customers:update","customers:delete"]}
```

Unauthenticated GET returns HTTP 401; expired session returns 401. Backend enforces rate limiting on login. Session cookies must use appropriate HttpOnly, Secure and SameSite attributes. Mutations must be validated against the XSRF-TOKEN cookie and X-XSRF-TOKEN header (or an equivalent, explicitly coordinated CSRF protection scheme). Do not issue bearer tokens to JavaScript merely for frontend convenience.

## Customers CRUD

| Method | Path | Permission | Result |
|---|---|---|---|
| GET | `/api/customers?limit=20&cursor=opaque&search=query` | customers:read | `CursorPage<Customer>` |
| GET | `/api/customers/:id` | customers:read | Customer |
| POST | `/api/customers` | customers:create | Customer |
| PATCH | `/api/customers/:id` | customers:update | Customer |
| DELETE | `/api/customers/:id` | customers:delete | 204 |

Customer:
```json
{"id":"019a7a5b-8705-7bed-8cc9-e5196b05e3af","name":"Example Customer","email":"customer@example.test","status":"active"}
```

Page response:
```json
{"items":[{"id":"019a7a5b-8705-7bed-8cc9-e5196b05e3af","name":"Example Customer","email":"customer@example.test","status":"active"}],"nextCursor":"opaque-signed-cursor"}
```

The cursor must be opaque and validated by the server. Use stable keyset ordering, scope cursors to tenant/filter/identity and reject tampered or expired cursors. The frontend holds a cursor history for previous-page navigation, resets search and history after mutations. No OFFSET requirement.

## Error envelope

Prefer `{"code":"CUSTOMER_NOT_FOUND","message":"Not found"}` with appropriate status: 400/401/403/404/409/422/429/500. The client maps errors to safe messages rather than displaying arbitrary server strings. For 429 do not automatically retry non-idempotent mutations.

## Security boundary

Every endpoint must authorize the current identity AND its tenant/resource scope. Never trust permissions merely supplied in client JSON. For multi-tenant databases, enforce tenant filtering even on GET/:id, UPDATE and DELETE. Add API contract tests and end-to-end auth/permission/CSRF tests against the real backend before deployment.

For SDK generation later, publish an OpenAPI 3.1 document and replace handwritten feature DTOs while retaining validation at trust boundaries.

## Machine-readable source of truth

OpenAPI 3.1 schema now lives at `openapi/openapi.json` and covers the session and customers reference endpoints, error bodies, opaque cursors, cookie authentication and CSRF header. Run `bun run contract:check` after schema/DTO changes. Current TypeScript DTOs are handwritten but checked for field names; full SDK code generation can be integrated after the Bun lockfile is finalized.

Session probe retry is explicit, protected API 401 invalidates frontend identity, and 403 does not. Cursor GET on 400/410/422 may recover at the first page once; no automatic retries for mutations or rate limiting.
