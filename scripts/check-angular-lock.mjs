import { readFileSync } from 'node:fs';

const manifest = JSON.parse(readFileSync('package.json', 'utf8'));
const lock = readFileSync('bun.lock', 'utf8');
const errors = [];
const declared = manifest.devDependencies?.typescript;
const rootBlock = lock.match(/"devDependencies"\s*:\s*\{([\s\S]*?)\}/);
const lockedRange = rootBlock?.[1]?.match(/"typescript"\s*:\s*"([^"]+)"/)?.[1];
const lockedVersion = lock.match(/"typescript"\s*:\s*\[\s*"typescript@([^"]+)"/)?.[1];

if (manifest.packageManager !== 'bun@1.4.4') {
  errors.push('Use the pinned Bun 1.4.4 package manager.');
}
if (!/^~6[.]0[.][0-9]+$/.test(declared ?? '')) {
  errors.push('Angular 22 requires a TypeScript 6.0.x manifest range, not ' + declared);
}
if (lockedRange !== declared) {
  errors.push('bun.lock workspace TypeScript range (' + lockedRange + ') differs from package.json (' + declared + ').');
}
if (!/^6[.]0[.][0-9]+$/.test(lockedVersion ?? '')) {
  errors.push('bun.lock resolves TypeScript ' + (lockedVersion ?? '(missing)') + '; Angular 22 needs 6.0.x.');
}
if (errors.length) {
  for (const message of errors) console.error('[dependency-contract] ' + message);
  console.error('[dependency-contract] Restore compatibility using Bun; do not hand-edit bun.lock.');
  process.exitCode = 1;
} else {
  console.log('[dependency-contract] Angular 22 / TypeScript ' + lockedVersion + ' / Bun lockfile aligned.');
}
