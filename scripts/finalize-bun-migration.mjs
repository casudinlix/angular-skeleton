import { existsSync, readFileSync, statSync, unlinkSync } from 'node:fs';

const path = 'bun.lock';
if (!existsSync(path) || statSync(path).size < 100) {
  console.error('bun.lock is missing or incomplete. Run "bun install" with Bun 1.4.4 first.');
  process.exit(1);
}
const lock = readFileSync(path, 'utf8');
if (!lock.includes('angular-skeleton') && !lock.includes('@angular/core')) {
  console.error('bun.lock does not appear to describe this project. Original npm lockfile preserved.');
  process.exit(1);
}
if (existsSync('package-lock.json')) {
  unlinkSync('package-lock.json');
  console.log('Removed package-lock.json after bun.lock was generated.');
}
console.log('Review bun.lock, run "bun install --frozen-lockfile", then commit bun.lock and the npm lockfile removal.');
