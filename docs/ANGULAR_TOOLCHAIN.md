# Angular 22 / Bun: compiler initialization failure

## Symptom

```text
Angular compilation initialization failed. [plugin angular-compiler]
TypeError: Cannot read properties of undefined (reading 'Error')
  at readConfiguration (.../@angular/compiler-cli/...)
```

## Root cause verified in this repository

A merge on `main` installed **TypeScript ~7.0.2**, while Angular 22's TypeScript peer range is **>=6.0.0 <6.1.0**. TypeScript 7's public JavaScript exports don't provide the compiler API Angular 22 requires. The resulting error is a secondary exception in Angular's diagnostic fallback, *not* a broken `angular.json` or template.

Reference: https://angular.dev/reference/versions

## Repair on a local machine (Bun only, GitHub Actions paused)

```bash
git fetch origin
git switch fix/angular22-ts6-bun-compiler
bun add -d "typescript@~6.0.3"
bun install --frozen-lockfile
bun run toolchain:check
bun run start
```

`bun add` updates **both** `package.json` and `bun.lock` with the actual resolved tarball and integrity. Commit the updated lockfile to the branch once local startup and builds pass:

```bash
bun run check
bun run build
git add package.json bun.lock
git commit -m "build: lock Angular-compatible TypeScript 6"
git push origin fix/angular22-ts6-bun-compiler
```

You can use `bun install` (without frozen mode) first if a local manifest/lockfile mismatch exists. Never hand-edit `bun.lock`; avoid wiping all dependencies unless a targeted reinstall fails. On a corrupted install, run `bun install --force` before considering a full deletion of `node_modules`.

If you see `Unsupported Node.js` as well, update Node.js to an Angular-supported version. Bun is the **package manager**, not a reason to ignore Angular's Node and TypeScript compatibility requirements.

## Prevent recurrence

`scripts/check-angular-toolchain.mjs` runs before start, build, check and unit tests. It asserts the installed Node version, TypeScript 6.0.x and the required JS Compiler API. Any upgrade across Angular/TypeScript major versions must be explicitly checked against https://angular.dev/reference/versions and the peer ranges of `@angular/compiler-cli` and `@angular/build`.

No GitHub Actions workflow is present or run. Quality checks are local only.
