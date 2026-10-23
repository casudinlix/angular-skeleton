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

## Browser compatibility and responsive rules (mandatory)

- Support Angular 22's official widely-available Web Platform Baseline. Never promise obsolete browsers (IE/unsupported WebViews); never expand Angular CLI browserslist beyond its supported targets.
- Every component must reflow at CSS viewport widths **280/320/360/375/390/430/600/768/1024/1280/1440/1920**, in portrait and landscape as relevant. Zoom and OS text scaling must not hide controls or produce document-level horizontal scrolling.
- Use mobile-first Tailwind CSS v4, `min-w-0`, `max-w-full`, `flex-wrap`, intrinsic Grid `minmax(0,1fr)`, relative sizes and shared responsive primitives. Avoid fixed widths, `overflow-x-hidden` as a cover-up, browser sniffing and unnecessary viewport JavaScript.
- Wide tables must have `app-scroll-region`, an accessible label and `tabindex="0"`; dialogs must constrain dimensions and scroll inside small viewports.
- Honor mobile safe areas, stable/dynamic viewport unit fallbacks, >=16px form controls on mobile Safari, keyboard focus, reduced motion and >=44px preferred tap targets. Do not disable user zoom.
- **Plus Jakarta Sans** via Google Fonts is the standard UI font. Preserve a system font fallback. SVG assets are preferred for high-density (Retina/HiDPI) screens; CSS breakpoints depend on CSS pixels, not device pixel ratio.
- Run `npm run layout:check` and the Chromium/Firefox/WebKit/iOS-WebKit/Android-Chromium/Retina Playwright suite. Review on real Apple and Android devices for production.
- Read `docs/BROWSER_COMPATIBILITY.md` before creating or revising UI. Browser compatibility is a release gate, not an optional visual check.
