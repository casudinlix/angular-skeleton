# Instructions for Gemini, Codex, Hermes and other agents

Read these files first: `README.md`, `ARCHITECTURE.md`, `CODING_RULES.md`, `docs/API_CONTRACT.md` and `docs/TESTING.md`. Use https://angular.dev as the authoritative Angular documentation.

## Required workflow
- Inspect the actual repo, lockfile, installed versions and current API contracts before coding. Do not assume CI has passed.
- Keep TS in `src/app/features/<module>/` and HTML in `src/app/templates/<module>/`; use external `templateUrl` with correct relative paths.
- Keep generic UI primitives in `shared/ui/`; use Tailwind v4 tokens with static class literals. Prefer native and accessible HTML.
- Add both `id.json` and `en.json` entries for user-facing strings. Do not bloat `i18n.service.ts`.
- Use typed API contracts plus runtime validation. Preserve cursor/keyset pagination, timezone-qualified timestamps and backend-based tenant permissions.
- Never use demo identity, localStorage JWT, frontend route guards or hidden buttons as real authentication/security.
- For changes to existing routes/forms, preserve user-visible behavior and server contracts. New modules require loading, empty, error, forbidden, tests and mobile states.
- Use the generator for new features where appropriate and review the generated service, permissions and translations.
- Run all CI quality gates that are available. Report observed results and blockers; never claim green from code inspection alone.
- Leave draft PR unmerged until lockfile exists and CI/build/security checks actually pass.
