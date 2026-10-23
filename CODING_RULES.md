# Coding rules

1. Standalone Angular components with lazy feature routes and OnPush.
2. Strict TypeScript; no any.
3. Colocate domain DTOs and API services per feature.
4. Use signals for local state, typed HttpClient for remote state.
5. Session, tenant isolation, CSRF and RBAC require real backend enforcement.
6. Respect accessibility, ID/EN translations, timezone policy, cursor pagination.
7. Do not commit secrets. Verify build, lint and unit tests before production.
