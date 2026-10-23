# Shared UI system

- Angular 22 standalone components, Tailwind CSS v4 CSS-first `@theme` tokens in `src/styles.css`.
- Colors: brand (teal/green) for primary actions; neutral slate for layout. Use red only for destructive/error states.
- Light/dark theme toggling via `ThemeService` with non-sensitive user preference persisted.
- Shared primitives in `src/app/shared/ui/`:
  - `UiButtonDirective`: primary / secondary / danger variants.
  - `UiInputDirective`: styled input, select and textarea.
  - `UiDataTableDirective`: table baseline with semantic thead/tbody/th scope.
  - `UiDialogDirective`: native HTML dialog, browser-managed keyboard handling; form labels/focus still mandatory.
  - `UiEmptyState`, `UiLoadingSpinner`, `UiSkeleton` for loading and empty states.
  - `ToastService` and `UiToastContainer` for notification queue (dismissible).
- Shared components must be keyboard-accessible, work at 320px, handle error/loading/empty/disabled states, and use actual source data.
- Prefer 1-2 CTA colors per view and avoid overdecorated admin dashboards.
- Place project-owned static images in `public/assets/`; optimize and license media before including.
- Forms use Angular ReactiveForms validators with server-side validation retained. Do not trust browser-only validation.
- Use the customers module as baseline for CRUD layout, permission-aware actions and cursor pagination.

## Layout contract and typography

The only default app font is **Plus Jakarta Sans** (Google Fonts CSS, weights 400-800, `display=swap`) with native system fallbacks. Responsive breakpoints target **CSS viewport width** rather than physical display resolution. Do not introduce fixed pixel widths for app shells, tables that expand the whole document, or blanket overflow hiding.

- Shell: fluid Grid/Flex with `min-w-0`, no body minimum width. Sidebar collapses on mobile with a keyboard-accessible toggle.
- Controls: at least 44x44 CSS pixels for primary mobile touch actions; inputs at least 16 CSS px on iOS Safari.
- Wide data: `app-scroll-region` labelled, focusable, and independently scrollable.
- Dialogs: native `dialog` with constrained width, `vh` fallback and `dvh` enhancement for dynamic browser chrome.
- Footer/edge spacing: safe-area support; no overlapped fixed navigation or forms.
- Respect `prefers-reduced-motion`, zoom/reflow, keyboard focus, and screen readers.

See `docs/BROWSER_COMPATIBILITY.md`. Any new component must pass cross-browser responsive E2E before merging.
