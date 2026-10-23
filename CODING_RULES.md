# Coding rules

1. Follow https://angular.dev/style-guide, Angular 22 standalone components, TypeScript strict mode, `inject()`, signals and OnPush. Avoid NgModules for new features.
2. Keep all HTML in `src/app/templates/<module>/` and logic/services/types/specs in `src/app/features/<module>/`. Component `templateUrl` is relative to its TypeScript file. Do not write large inline component templates.
3. Put user-facing translations in both `src/app/core/i18n/locales/id.json` and `en.json`. Use `I18nService.translate()` with typed keys. Run `npm run i18n:check`.
4. Store public brand/image/icon/font assets in `public/assets/<type>/`. Never include private data, tokens, user uploads or secrets.
5. Use Tailwind CSS v4 and its semantic design tokens; do not create dynamic class fragments or add random global overrides. Build reusable primitives in `shared/ui/`.
6. Use reactive forms and typed validators. Inputs require proper label, keyboard focus, error, loading, disabled and empty states.
7. Keep API DTOs typed and validate untrusted responses at boundaries; do not use `any`, unchecked assertions or `as unknown as`.
8. Client route guards and permission-aware buttons are UX only. All operations require server-side authentication, authorization, CSRF defense and tenant isolation.
9. Frontend never stores tokens in localStorage. Use same-origin secure HttpOnly cookie sessions, server-supplied CSRF cookie/header, and safe error messages.
10. Backend lists default to cursor pagination, support stable sorting and avoid OFFSET; handle invalid cursors and reset on mutation.
11. Dates from backend use ISO 8601 with UTC/offset. Format with Intl and explicit application/user timezone, never assume the browser timezone equals business timezone.
12. New modules use `npm run generate:feature -- <name>` or the schematic, then adapt types, auth permission, both locales, tests and route labels.
13. Before merge: `npm run i18n:check`, `npm run structure:check`, `npm run check`, `npm run lint`, `npm test`, `npm run build`, `npm run e2e` and vulnerability scanning. If not run, state that clearly.
