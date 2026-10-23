# Frontend deployment

Angular 22 authenticated CMS is a client-side rendered static application by default. The production build is typically served from `dist/angular-skeleton/browser`.

## Reverse proxy requirements

- HTTPS for every production origin, with HSTS only after HTTPS is confirmed.
- Serve static assets with caching; fingerprinted build JS/CSS may use immutable caching.
- SPA routes must fall back to `index.html` when they do not match a real static file.
- `/api/*` must be proxied to the actual backend **before** the SPA fallback, retaining the correct cookie/session origin and request IDs.
- Do not rewrite API 401, 403 or 500 errors into HTML.
- Set a reviewed Content Security Policy, frame protection, Referrer-Policy and appropriate Permissions-Policy; validate each header against actual third-party dependencies.
- Never bake credentials or server-side secrets into frontend environment files or `public/`.

Dev only: `proxy.conf.json` forwards /api to localhost:3000. Adjust for your backend in development; this config is not automatically deployed.

## Release

1. Commit `package-lock.json`; perform clean `npm ci` on supported Node.
2. Run all gates in `docs/TESTING.md`, including E2E and server auth/isolation testing.
3. Configure deployment origin, /api proxy, CSP, HTTPS, tenant-specific domain rules and 404 fallback.
4. Promote the built asset as an immutable release, monitor frontend errors and maintain rollback capability.
5. Restrict public folders to licensed and non-sensitive assets.
