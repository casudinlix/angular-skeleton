# Agent instructions (Gemini, Codex, Hermes and other agents)

Before editing code, read `README.md`, `ARCHITECTURE.md` and `CODING_RULES.md`. Follow official https://angular.dev documentation and use strict TypeScript.

## Structure is mandatory

- Logic, route components, services, and DTOs belong to `src/app/features/<module>/`.
- Place component HTML files in `src/app/templates/<module>/`. Use `@Component({ templateUrl: '...' })` with a path relative to the TS component. Do not inline multi-line HTML.
- Put every UI translation into both `src/app/core/i18n/locales/id.json` and `en.json`; inject `I18nService` for runtime lookup, then validate key parity.
- Store static, publicly accessible assets under `public/assets/`. Verify Angular build asset mapping; never commit secrets there.
- Respect API contracts, cursor pagination, server-side authorization/tenant isolation, accessibility, tests and error/loading/empty states.

Before declaring done, run relevant checks or explicitly record why they could not run. Never represent demo authentication as actual security.
