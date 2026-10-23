# Static asset directories

This directory is copied to the site's output root by the Angular build.

- `assets/branding/`: app logo, wordmark and identity assets
- `assets/icons/`: static SVG icons and favicons
- `assets/images/`: image resources used by the UI
- `assets/illustrations/`: illustrations and empty states
- `assets/fonts/`: self-hosted fonts only if their redistribution licenses permit

Reference an asset directly in an Angular template using `/assets/branding/logo.svg` (after adding that file). Do not import files from this directory into TypeScript. Avoid runtime secrets, sensitive data, source design files, large unused images, and user uploads; the files become publicly accessible.

If deploying under a non-root base path, use a base-href-compatible asset strategy instead of absolute-root URLs.
