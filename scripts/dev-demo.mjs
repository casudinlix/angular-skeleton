import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const api = spawn(process.execPath, ['scripts/demo-api.mjs'], {
  stdio: 'inherit',
  env: { ...process.env, DEMO_API_PORT: '3000' },
});
let angular;
let shuttingDown = false;
function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;
  angular?.kill('SIGTERM');
  api.kill('SIGTERM');
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
api.on('error', error => { console.error('[demo]', error.message); shutdown(); process.exitCode = 1; });
api.on('exit', (code, signal) => {
  if (!shuttingDown) {
    console.error('[demo] Local API stopped:', code ?? signal);
    shutdown();
    process.exitCode = code || 1;
  }
});

let ready = false;
for (let i = 0; i < 40 && !shuttingDown; i++) {
  try {
    const response = await fetch('http://127.0.0.1:3000/_demo/health', { signal: AbortSignal.timeout(1000) });
    const data = await response.json();
    if (response.ok && data?.mode === 'local-demo') { ready = true; break; }
  } catch { /* Probe only: demo API may not have started yet. */ }
  await delay(125);
}

if (!ready) {
  console.error('[demo] DEMO API did not start; Angular was not started.');
  shutdown();
  process.exitCode = 1;
} else {
  console.log('[demo] Starting Angular in opt-in demo configuration...');
  angular = spawn(process.execPath, [
    'node_modules/@angular/cli/bin/ng.js', 'serve', '--configuration', 'demo',
    ...process.argv.slice(2),
  ], { stdio: 'inherit' });
  angular.on('error', error => { console.error('[demo]', error.message); shutdown(); process.exitCode = 1; });
  angular.on('exit', (code, signal) => {
    if (!shuttingDown) {
      shutdown();
      process.exitCode = code ?? (signal ? 1 : 0);
    }
  });
}
