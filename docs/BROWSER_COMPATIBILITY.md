# Browser compatibility, viewport and responsive-layout contract

This policy is **mandatory** for every future product/module based on the Angular Skeleton.

## Supported platforms

Angular 22 uses the **widely available Web Platform Baseline** dated 2026-05-07. Officially supported desktop engines include current supported Chrome/Edge (Blink), Firefox (Gecko), and Safari (WebKit). Mobile targets include iOS Safari/WebKit and Android Chromium browsers supported by Angular's published Baseline. Other evergreen browsers may work but need explicit verification. **Internet Explorer, outdated embedded WebViews and every historical browser version are not promised.**

Sources: https://angular.dev/reference/versions and https://angular.dev/tools/cli/build.

Keep Angular CLI's default browserslist targeting. Do **not** extend it beyond browsers Angular supports. Browser polyfills are allowed only for an identified feature gap and after tested evidence; broad polyfills create maintenance and security debt.

## One adaptive layout, not separate retina layouts

- Use **CSS pixels and rem-based breakpoints** to control responsive layout; screen resolution and device pixel ratio do not determine CSS layout.
- Prefer intrinsic flex/grid: `minmax(0, 1fr)`, `min-w-0`, `max-w-full`, `flex-wrap`, `clamp()`, and relative padding. Prevent content widths from widening the document.
- Do not hard-code desktop widths on a module container. Avoid `min-width: 320px` on html/body, horizontal overflow suppression, and user-agent sniffing.
- Use Tailwind CSS v4 defaults for mobile-first responsive styles. CSS controls view changes; do not introduce `@angular/cdk/layout` merely to detect a viewport width. If a behavior genuinely needs breakpoints in TypeScript, prefer Angular CDK `BreakpointObserver` and lifecycle-safe subscriptions over custom resize listeners.
- Render large data tables inside `app-scroll-region` with keyboard focus (`tabindex="0"`) and a text label. The *table* may scroll horizontally; the **document** must not.
- Never rely on hover alone. Make interactive controls keyboard reachable, show focus and target at least 44 × 44 CSS pixels whenever practicable.
- Accommodate browser text scaling, system font scaling and zoom without clipping crucial controls. Maintain sensible line wrapping.
- Mobile bottom/edge padding uses `env(safe-area-inset-*, 0px)`. Page minimum height falls back to `100vh` before `100svh`; constrained overlays use `100dvh` when available, with `vh` fallback.
- On mobile, form input font size is **at least 16 CSS px** to avoid unexpected focus zoom on iOS Safari.
- Modal dialogs must have a constrained width and scroll internally on short/landscape screens. Use native `<dialog>` unless a product has proven needs exceeding its capabilities.
- Support `prefers-reduced-motion`, both light/dark palettes, print, safe keyboard navigation and error/empty/loading states.

## Fonts, icons and high-density displays

- Default Google Fonts family: **Plus Jakarta Sans**, weights 400, 500, 600, 700, 800, `display=swap`; system UI fonts are fallback when Google Fonts are blocked/offline.
- This remote stylesheet requires explicit `style-src` permission for `https://fonts.googleapis.com` and `font-src` permission for `https://fonts.gstatic.com` under restrictive Content Security Policy. Products requiring offline operation/privacy-strict delivery should self-host properly licensed font subsets rather than removing the fallback.
- Use SVG for logos and UI icons wherever possible. For photographic raster images use sensible `srcset`/`sizes` and correctly sized modern formats; don't use huge 2× images indiscriminately.
- Retina/HiDPI affects **asset density**, not breakpoint selection. Verify assets at deviceScaleFactor 1, 2 and mobile emulation.

## Browser test matrix (local release gate; GitHub CI paused)

Playwright engines: Chromium, Firefox, WebKit, Android/Chromium emulation, iOS/WebKit emulation, desktop Chromium DPR2. Emulation provides early regression detection; WebKit on Linux is not a substitute for testing Safari on actual Apple hardware.

Mandatory CSS viewport widths: 280 (stress case), 320, 360, 375, 390, 430, 600, 768, 1024, 1280, 1440 and 1920 pixels. Include short landscape height, 200% text scaling, 400% browser zoom equivalent via reduced CSS viewport, dark mode and keyboard navigation.

Acceptance criteria:
1. No document-level horizontal scrolling for ordinary screens; local table scrollers permitted.
2. Mobile navigation opens/closes and desktop navigation remains accessible after viewport changes.
3. Controls, error messages and dialogs remain usable with large text, narrow widths and keyboard only.
4. Image assets remain legible at higher device pixel ratios; external font errors fall back gracefully.
5. Source structure check, Angular build/typecheck, lint, Vitest and multi-engine Playwright pass.

Run `bun run layout:check`, `bun run e2e` and the other gates documented in `docs/TESTING.md`. Manual release QA on real iPhone/iPad Safari, Android Chrome, desktop Firefox and Chromium Edge remains necessary for production UI/UX acceptance.
