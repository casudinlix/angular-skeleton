import { readFileSync } from 'node:fs';

const angular = JSON.parse(readFileSync('angular.json', 'utf8'));
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const proxy = JSON.parse(readFileSync('proxy.conf.json', 'utf8'));
const config = angular.projects['angular-skeleton'].architect;
const errors = [];

if (proxy['/api']?.target !== 'http://127.0.0.1:3000') {
  errors.push('Development API proxy must explicitly use 127.0.0.1:3000.');
}
const replacements = config.build.configurations.demo?.fileReplacements ?? [];
if (replacements.length !== 1
    || replacements[0].replace !== 'src/app/core/config/demo-mode.ts'
    || replacements[0].with !== 'src/app/core/config/demo-mode.enabled.ts') {
  errors.push('Only the explicit demo build may replace the demo-mode flag.');
}
for (const environment of ['development', 'production']) {
  const replacementsForBuild = config.build.configurations[environment]?.fileReplacements ?? [];
  if (replacementsForBuild.some(replacement => replacement.with.includes('demo-mode.enabled'))) {
    errors.push(environment + ' must not enable the demo flag.');
  }
}
if (config.serve.configurations.demo?.buildTarget !== 'angular-skeleton:build:demo') {
  errors.push('The demo serve configuration must resolve to the demo build.');
}
if (pkg.scripts.start?.includes('demo')
    || pkg.scripts.build?.includes('demo')) {
  errors.push('Normal development and production scripts must not depend on demo mode.');
}

if (errors.length) {
  errors.forEach(message => console.error('[demo-configuration] ' + message));
  process.exitCode = 1;
} else {
  console.log('[demo-configuration] Demo flag is isolated from ordinary and production builds.');
}
