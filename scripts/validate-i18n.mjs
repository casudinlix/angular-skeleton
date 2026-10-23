import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const directory = resolve('src/app/core/i18n/locales');
const locales = Object.fromEntries(
  ['id', 'en'].map((language) => [
    language,
    JSON.parse(readFileSync(resolve(directory, language + '.json'), 'utf8')),
  ]),
);

const reference = Object.keys(locales.id).sort();
const other = Object.keys(locales.en).sort();

if (JSON.stringify(reference) !== JSON.stringify(other)) {
  console.error('Translation keys in id.json and en.json do not match.');
  process.exitCode = 1;
}

for (const [language, messages] of Object.entries(locales)) {
  for (const [key, value] of Object.entries(messages)) {
    if (typeof value !== 'string' || value.trim().length === 0) {
      console.error('Invalid translation: ' + language + '.' + key);
      process.exitCode = 1;
    }
  }
}

if (!process.exitCode) console.log('ID and EN translations are complete.');
