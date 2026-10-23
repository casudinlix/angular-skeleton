# Test and release checklist

## Automated scripts
```sh
npm install             # first install must generate the lockfile
npm run i18n:check      # both JSON locales contain the same valid keys
npm run structure:check # external Angular templates resolve from their TS files
npm run check           # Angular development build (includes Angular template compilation)
npm run lint            # ESLint + angular-eslint
npm test                # Angular CLI Vitest unit tests
npm run test:coverage
npm run build           # optimized production build and budgets
npx playwright install chromium
npm run e2e             # desktop and mobile Chromium
npm audit --omit=dev --audit-level=high
```

After lockfile generation, commit `package-lock.json`, then switch fully to `npm ci`. Keep dependencies pinned via lockfile and group dependency upgrades.

## Required manual review
- Sign in with a real backend, session restoration, invalid credentials and logout failure.
- Session expiry and 401 handling, resource-level 403, CSRF denial, and cross-tenant isolation (backend tests).
- Customer create/update/delete validation, duplicate conflict, pagination consistency and cursor expiry.
- Responsive layout (320px, 768px, 1280px), keyboard tabbing, dialog focus/escape, screen reader headings and errors.
- Both languages, theme persistence, empty/load/error states, invalid API payloads, dates and timezone formatting.
- Network/browser DevTools: no secrets in public assets, localStorage, URLs, logs or telemetry.
- Production reverse proxy fallback and caching/security headers.

## Evidence status at authoring
Static source, route path and JSON inspection can be done through GitHub. There is no executed Angular compilation, npm install, lint, unit test or E2E result in the authoring environment because registry access is unavailable and Node version is below Angular 22's minimum. The PR stays draft until the above gates pass.
