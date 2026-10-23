# Angular Skeleton

Angular 22 standalone, signals, zoneless, lazy feature routing and strict TypeScript. Core contracts for ID/EN, session identity, typed API and cursor pagination. Designed as reusable enterprise frontend foundation.

## Development

Requirements: Node 22.22.3+ and npm (subject to Angular 22 compatibility matrix).

```sh
npm install
npm start
npm run build
npm test
```

The main route provides a lightweight demo page. `/customers` requires a working `/api/customers` backend. Backend sessions, CSRF and permissions MUST be implemented and verified before production deployment. Frontend identity service is an abstraction, not authentication.

**Validation status:** no npm install, test or build was performed because package registry was inaccessible. Dependency versions, lockfile, CI and compilation need verification before reuse. This is an initial baseline, not a production-ready skeleton.

See ARCHITECTURE.md, CODING_RULES.md and AGENTS.md.
