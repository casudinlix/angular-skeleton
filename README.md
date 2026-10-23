# Angular Skeleton

Reusable Angular 22 frontend foundation for admin panels and internal enterprise CMS. **Draft until the CI and lockfile checks pass.**

Built with standalone components, zoneless rendering, signals, lazy-loaded routes, strict TypeScript, Tailwind CSS v4, JSON ID/EN i18n, typed API boundaries, form validation, accessible native dialogs, and cursor-based pagination.

## Requirements

- Node.js 22.22.3+ (alternatively compatible Node 24.15+ or Node 26), npm
- Angular 22 / TypeScript >=6.0 <6.1
- A real backend for authenticated features (default dev proxy http://localhost:3000)

```bash
npm install
npm start
npm run i18n:check
npm run structure:check
npm run check
npm run lint
npm test
npm run build
npm run e2e
```

**Dependency lock:** `package-lock.json` was generated on GitHub Actions using npm 11.19.1 and is committed. Use `npm ci` for clean repeatable installs.

## Architecture

```text
src/app/
├── app.ts                    # Top-level shell/controller
├── app.routes.ts
├── core/
│   ├── auth/                 # Backend session + auth and permission guards
│   ├── config/               # Public, non-secret runtime defaults
│   ├── http/                 # Interceptors, cursor types, API errors
│   ├── i18n/
│   │   ├── locales/id.json
│   │   ├── locales/en.json
│   │   └── i18n.service.ts
│   └── theme/
├── features/
│   ├── auth/                 # Login + validation
│   ├── customers/            # Full reference CRUD and cursor table
│   ├── errors/               # 401, 403, 404, 500, maintenance
│   └── home/
├── shared/ui/                # Button, Input, DataTable, Dialog, EmptyState,
│                             # Skeleton, Spinner, Toast service/container
└── templates/
    ├── app/
    ├── auth/
    ├── customers/
    ├── errors/
    ├── home/
    └── shared/
public/assets/
├── branding/
├── icons/
├── images/
├── illustrations/
└── fonts/
tools/
├── generate-feature.mjs      # Reliable npm feature generator
└── schematics/               # Angular schematic collection
```

The user-selected convention keeps all HTML under `templates/<module>/` and TypeScript code in `features/<module>/`. `templateUrl` paths are relative to the component TypeScript file.

## Features

- Routes are lazy-loaded and protected only when a backend-verified session and permission is required.
- API session: `GET /api/session`, `POST /api/session`, `DELETE /api/session`.
- Customer API: `GET /api/customers`, `GET /api/customers/:id`, `POST /api/customers`, `PATCH /api/customers/:id`, `DELETE /api/customers/:id`.
- Customer list supports debounced server search, cursor next/previous, empty/loading/error states, and permission-aware create/edit/delete actions.
- Two languages (ID and EN) are compiled from JSON; locale switch persists preference in localStorage (never credentials). A timezone-aware formatter defaults to Asia/Jakarta.
- Tailwind v4 supports dark mode and design tokens. Static assets in `public/` are copied to the site's root during build.

## Generate a feature

```bash
npm run generate:feature -- orders
```

The generator creates `features/orders/*`, `templates/orders/orders.page.html`, a typed service/model starter, a basic unit test, a route with `orders:read` permission and new ID/EN translation keys.

An Angular CLI schematic is also included under `tools/schematics/`; once Angular CLI is installed, it can be exercised with:

```bash
npx ng generate ./tools/schematics:feature --name orders --dry-run
```

Run **one** of the generators, not both. Check the generated contract and translation before use. Generator runtime and Angular CLI invocation are not verified in this environment.

## Documents

- [Architecture](ARCHITECTURE.md), [Coding Rules](CODING_RULES.md), [Agent Instructions](AGENTS.md)
- [API contract](docs/API_CONTRACT.md), [UI design system](docs/UI_SYSTEM.md)
- [Testing and release gates](docs/TESTING.md), [Deployment](docs/DEPLOYMENT.md), [Security](SECURITY.md)

## Readiness

Source is committed on PR #1 and not merged to main. GitHub Actions has successfully run dependency installation, Angular compilation, lint, Vitest, Playwright and dependency audit on the implementation before this final lockfile commit. Local execution remains unavailable. Final npm-ci CI results must be checked before marking the PR ready. Production deployment still requires a real backend and security review.
