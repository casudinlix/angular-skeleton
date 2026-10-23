import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';

const root = resolve('src/app');
const errors = [];
function walk(directory) {
  for (const file of readdirSync(directory)) {
    const path = join(directory, file);
    if (statSync(path).isDirectory()) walk(path);
    else if (path.endsWith('.ts') && !path.endsWith('.spec.ts')) {
      const content = readFileSync(path, 'utf8');
      const external = content.match(/templateUrl:\s*['"]([^'"]+)['"]/);
      if (/\@Component\s*\(/.test(content) && !external) {
        errors.push('Component missing templateUrl: ' + path);
      }
      if (external && !existsSync(resolve(dirname(path), external[1]))) {
        errors.push('Broken templateUrl: ' + path + ' => ' + external[1]);
      }
    }
  }
}
walk(root);
if (errors.length) {
  errors.forEach(error => console.error(error));
  process.exit(1);
}
console.log('Angular component template paths are valid.');
