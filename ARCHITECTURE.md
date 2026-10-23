# Angular Skeleton Architecture

- Angular standalone components and lazy feature routes.
- Feature-first folders: core/, shared/, layout/, features/.
- Signals for local state; HttpClient and typed OpenAPI contracts for remote data.
- Server-side tenant isolation, RBAC, and secure cookie sessions; browser route guards are not security boundaries.
- Cursor/keyset pagination instead of OFFSET.
- Bahasa Indonesia and English, explicit timezone formatting.
- TypeScript strict, accessibility, tests, lint, build and dependency auditing required before production.
