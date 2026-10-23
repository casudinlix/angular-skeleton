import { existsSync, readFileSync, statSync, unlinkSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

// A real lockfile must be produced by Bun, never approximated from dependencies.
const lockfile = 'bun.lock';
if (!existsSync(lockfile) || statSync(lockfile).size < 100) {
  console.error('bun.lock is absent or empty. Run "bun install" with the pinned Bun version.');
  process.exit(1);
}
const contents = readFileSync(lockfile, 'utf8');
if (!contents.includes('angular-skeleton') || !contents.includes('@angular/core')) {
  console.error('bun.lock does not describe the expected Angular project.');
  process.exit(1);
}

// Check that package.json and the newly imported lock agree BEFORE deleting npm's lock.
const check = spawnSync('bun', ['install', '--frozen-lockfile', '--dry-run'], {
  stdio: 'inherit',
  shell: false,
});
if (check.error || check.status !== 0) {
  console.error('Frozen Bun lockfile check failed. Preserving package-lock.json.');
  process.exit(1);
}

if (existsSync('package-lock.json')) {
  unlinkSync('package-lock.json');
  console.log('Legacy package-lock.json removed after Bun lock verification.');
}
console.log('bun.lock is ready. Commit bun.lock and package-lock.json deletion together.');
