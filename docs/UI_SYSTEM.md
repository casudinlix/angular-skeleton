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
