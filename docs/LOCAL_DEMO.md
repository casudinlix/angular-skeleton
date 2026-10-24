# Local demo API for Angular Skeleton

## Why this exists

The Angular frontend lives at `localhost:4200` and proxies `/api` to `127.0.0.1:3000`. Without an actual backend, visiting Customers/session-protected sample pages can cause `ECONNREFUSED` in the Vite proxy. This is **not an Angular compilation failure**.

Use the isolated demo launcher only when you want to evaluate UI or sample CRUD **without** connecting a real backend.

## One-command demo (Bun scripts, Node-based local runner)

```sh
bun install --frozen-lockfile
bun run demo
```

Open `http://localhost:4200/login` and use:

```text
Email: demo@example.test
Password: demo12345
```

The demo profile displays an unmistakable **DEMO MODE / DATA SINTETIS** badge. Then open the Customers page to try:

- Login/session restore/logout
- Local sample customer records, search and cursor pagination
- Create, update, and delete with Angular forms, dialogs, toast, and validation

The local sample data starts with 36 synthetic customer records, is kept in process memory only, and resets when the demo process stops. It is **not** your actual CRM/billing data.

You can exercise only the standalone mock API on port 3000 with `bun run demo:api`, and run its standalone local unit checks with `bun run demo:test`. The launcher is an opt-in tool, not the standard backend.

## Normal backend mode

```sh
# Terminal 1: Start YOUR real backend bound to 127.0.0.1:3000
# Terminal 2:
bun start
```

Normal development proxies requests to the real backend at `127.0.0.1:3000` and does not inject synthetic records. If your backend runs elsewhere, adjust the local target in `proxy.conf.json` appropriately. This file only affects Angular's development server: production reverse proxies must be configured independently.

A 401 from `GET /api/session` without a session is **normal** (not a connection failure). A 403 means permission denied. An unreachable backend produces `ECONNREFUSED`, and it should not be silently mapped to a fake authenticated user.

## Safety boundaries

- The example backend binds **only 127.0.0.1**, never 0.0.0.0, and uses in-memory state.
- Demo credentials are public test credentials. Never use these credentials in any real system.
- The mock cookie/XSRF checks demonstrate the frontend contract but are **not production session or tenant security**.
- Angular's `demo` build configuration explicitly replaces `demo-mode.ts` with a demo-only flag. Default production and ordinary development keep that flag false.
- No routes, authentication guards, API contract, or protected endpoints are bypassed. The mocked backend authenticates demo credentials before customer access.
- The demo server is neither deployed nor copied into Angular browser output.
- GitHub Actions remains disabled as requested. Run local checks only.

## Local verification

```sh
bun run demo:test
bun run toolchain:check
bun run i18n:check
bun run structure:check
bun run layout:check
bun run lint
bun run build
```

For UI browser checks, start `bun run demo` separately and use Playwright locally. Production backend integration and real-device QA are separate release gates.
