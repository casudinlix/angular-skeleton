import './check-angular-lock.mjs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const issues = [];
const nodeVersion = process.versions.node;
const [major, minor, patch] = nodeVersion.split('.').map(Number);
const supportedNode = (major === 22 && (minor > 22 || minor === 22 && patch >= 3))
  || (major === 24 && (minor > 15 || minor === 15 && patch >= 0))
  || major === 26;

if (!supportedNode) {
  issues.push(
    `Unsupported Node.js ${nodeVersion}. Angular 22 requires Node.js ^22.22.3, ^24.15.0 or ^26.0.0.`,
  );
}

try {
  const ts = require('typescript');
  const installed = typeof ts.version === 'string' ? ts.version : 'unknown';
  const hasCompilerApi =
    typeof ts.DiagnosticCategory?.Error === 'number'
    && typeof ts.readConfigFile === 'function'
    && typeof ts.createProgram === 'function';

  if (!/^6[.]0[.][0-9]+(?:[-+].*)?$/.test(installed) || !hasCompilerApi) {
    issues.push(
      `Incompatible TypeScript ${installed} or missing TypeScript Compiler API. `
      + 'Angular 22 requires TypeScript >=6.0.0 <6.1.0. '
      + 'Run: bun add -d "typescript@~6.0.3" && bun install',
    );
  }
} catch (error) {
  issues.push(
    'Cannot load the TypeScript compiler package from node_modules. '
    + 'Run: bun install. ' + (error instanceof Error ? error.message : String(error)),
  );
}

if (issues.length > 0) {
  for (const issue of issues) console.error('[Angular toolchain] ' + issue);
  console.error(
    '[Angular toolchain] Verify the real resolved versions with: '
    + 'node -p "require(\'typescript\').version"',
  );
  process.exit(1);
}

console.log(`[Angular toolchain] Node.js ${nodeVersion}; TypeScript compiler API verified.`);
