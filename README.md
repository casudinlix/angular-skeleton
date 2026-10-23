# Angular Skeleton

An Angular 22 standalone foundation with strict TypeScript, lazy feature routing, signals, typed API boundaries and cursor pagination.

## Folder structure

```text
src/
├── app/
│   ├── core/
│   │   ├── auth/
│   │   ├── http/
│   │   └── i18n/
│   │       ├── i18n.service.ts
│   │       └── locales/
│   │           ├── id.json
│   │           └── en.json
│   ├── features/
│   │   ├── home/         # TypeScript logic and tests
│   │   ├── customers/    # API, models, UI logic
│   │   └── errors/
│   └── templates/
│       ├── app/
│       ├── home/
│       ├── customers/
│       └── errors/
└── styles.css
public/
└── assets/
    ├── branding/
    ├── icons/
    ├── images/
    ├── illustrations/
    └── fonts/
```

- Each component uses `templateUrl` to point to the corresponding HTML file in `src/app/templates/<module>/`; logic stays in its feature folder.
- Add user-visible text to both `src/app/core/i18n/locales/id.json` and `en.json`; `I18nService` provides typed lookup. The language switcher is in the global app header.
- `public/` is copied to the built site's output root; add `public/assets/branding/logo.svg` to reference it at `/assets/branding/logo.svg`. See `public/ASSETS.md`.
- Custom JSON translation lookup supports runtime switching. It is **not** Angular CLI's compile-time `@angular/localize` pipeline; locale-specific dates, currency, and plural rules need deliberate handling.

## Development

Use Node.js compatible with Angular 22 and npm:

```sh
npm install
npm start
npm run i18n:check
npm run check
npm run lint
npm test
npm run build
```

The `/customers` page requires a real `/api/customers` service returning `{ items, nextCursor }`. The demo `AuthService` exposes a client identity shape only; **it is not real authentication or authorization**. Implement and test server-backed sessions, CSRF controls, tenant isolation, and API permissions before production.

**Current verification:** GitHub file changes and configuration are committed in a draft PR, but `npm install`, lint, Angular template compilation, unit tests and full production build have not been verified because registry access is unavailable in this environment. No production-ready claim is made.

See `ARCHITECTURE.md`, `CODING_RULES.md`, `AGENTS.md`.
