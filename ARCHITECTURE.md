# Angular Skeleton Architecture

- Angular standalone components, lazy feature routes, signals, strict TypeScript, and OnPush.
- `features/<module>/` owns domain logic, route components, API services, models and tests.
- `templates/<module>/` owns only that module's Angular HTML templates. Each `templateUrl` is **relative to the TypeScript component file**. This is an intentional organizational convention, although Angular's official style guide generally recommends colocation.
- `core/` contains cross-cutting contracts only. Avoid domain-specific code in `core`.
- `core/i18n/locales/id.json` and `en.json` hold small runtime-switchable dictionaries; `I18nService` is only a typed loader/lookup. Keep keys aligned using `npm run i18n:check`. Locale-sensitive formatting is a separate concern.
- `public/assets/` holds static, public, build-copied resources. Never put credentials, private data or unoptimized user uploads there.
- Typed APIs should follow OpenAPI contracts when backend integration begins.
- Backend authoritatively validates authentication, tenant isolation and RBAC for every operation. Client guards are navigation aids, not security boundaries.
- Cursor/keyset pagination, never OFFSET, is the default for large datasets.
- API timestamps use timezone-qualified ISO 8601; user timezone should be explicit.
- Require TypeScript checks, Angular template checks, unit tests, lint and production build before merging.
