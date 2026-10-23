# Coding rules

1. Follow Angular's official component, dependency-injection, routing, signals and accessibility guidance. Use standalone components and OnPush.
2. Keep TypeScript classes, API models/services and tests in `src/app/features/<module>/`; put HTML templates in `src/app/templates/<module>/`. New pages must use `templateUrl`, never large inline `template` strings.
3. `templateUrl` paths are resolved **relative to the declaring TS file**, not the project root. Verify paths whenever moving a component.
4. Keep UI text in `src/app/core/i18n/locales/id.json` and `en.json`. Use `I18nService.translate(key)` and add the same nonempty keys to both. Run `npm run i18n:check`. Do not embed long dictionaries inside the service.
5. Place static images, icons, brand assets and fonts under `public/assets/<type>/` and reference as public URLs. No secrets or user uploads in `public/`.
6. Use strict TypeScript; avoid `any`, unchecked casts, and hand-built dynamic Tailwind classes.
7. Keep domain logic colocated by feature, use signals for local UI state and lifecycle-safe RxJS for remote state.
8. Preserve accessible labels, keyboard support, focus, mobile layout, and explicit loading, empty and error states.
9. Authentication, RBAC, tenant isolation, CSRF and security-critical validation MUST be enforced by the backend.
10. Prefer server-side cursor pagination. Format localized dates, numbers, currency and timestamps intentionally.
11. Run `npm run i18n:check`, `npm run check`, `npm run lint`, `npm test`, and `npm run build` before marking any PR production-ready.
