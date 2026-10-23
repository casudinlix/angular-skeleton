import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const errors = [];
const read = (path) => readFileSync(resolve(path), 'utf8');
const index = read('src/index.html');
const styles = read('src/styles.css');
const shell = read('src/app/templates/app/app.html');

if (!/name="viewport"[^>]*width=device-width[^>]*initial-scale=1[^>]*viewport-fit=cover/.test(index)) {
  errors.push('Missing accessible mobile viewport with safe-area support.');
}
if (/user-scalable\s*=\s*no|maximum-scale\s*=\s*1/i.test(index)) {
  errors.push('Disabling browser zoom is forbidden.');
}
if (!index.includes('fonts.googleapis.com/css2?family=Plus+Jakarta+Sans')) {
  errors.push('Plus Jakarta Sans must be loaded from Google Fonts.');
}
if (!styles.includes('--font-sans: "Plus Jakarta Sans"')) {
  errors.push('Plus Jakarta Sans must be the primary font with a system fallback.');
}
for (const name of ['app-viewport', 'app-scroll-region', 'app-dialog', 'app-touch-target', 'app-mobile-nav-closed']) {
  if (!styles.includes('.' + name)) errors.push('Missing responsive design primitive: ' + name);
}
if (!styles.includes('env(safe-area-inset-bottom') || !styles.includes('100dvh')) {
  errors.push('Missing mobile safe-area or dynamic viewport support.');
}
if (!shell.includes('min-w-0') || !shell.includes('app-mobile-nav-closed')) {
  errors.push('Shell must permit intrinsic reflow and collapsible mobile navigation.');
}
if (/body\s*\{[^}]*min-width\s*:\s*(?:320|360)px/i.test(styles)) {
  errors.push('Do not force a minimum viewport width on body.');
}

function inspectTemplates(directory) {
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) {
      inspectTemplates(path);
      continue;
    }
    if (!path.endsWith('.html')) continue;
    const markup = readFileSync(path, 'utf8');
    if (/\sstyle\s*=\s*["']/i.test(markup)) {
      errors.push('Inline HTML styles are forbidden: ' + path);
    }
    if (/\boverflow-x-hidden\b/.test(markup)) {
      errors.push('Do not hide horizontal overflow to conceal layout failures: ' + path);
    }
    if (/<table\b/i.test(markup) && !markup.includes('app-scroll-region')) {
      errors.push('Wrap wide tables in a keyboard-focusable, labelled local scrolling region: ' + path);
    }
  }
}
inspectTemplates(resolve('src/app/templates'));

if (errors.length) {
  errors.forEach((message) => console.error('ERROR: ' + message));
  process.exitCode = 1;
} else {
  console.log('Browser compatibility and responsive layout structure checks passed.');
}
