import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const name = process.argv[2];
if (!name || !/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(name)) {
  console.error('Usage: bun run generate:feature -- feature-name (lowercase kebab-case)');
  process.exit(1);
}
const root = resolve('.');
const className = name.split('-').map(part => part[0].toUpperCase() + part.slice(1)).join('');
const label = className.replace(/([a-z])([A-Z])/g, '$1 $2');
const feature = join(root, 'src/app/features', name);
const templates = join(root, 'src/app/templates', name);
const componentFile = join(feature, `${name}.page.ts`);
const htmlFile = join(templates, `${name}.page.html`);
const apiFile = join(feature, `${name}.api.ts`);
const modelFile = join(feature, `${name}.types.ts`);
const testFile = join(feature, `${name}.page.spec.ts`);
const routesFile = join(root, 'src/app/app.routes.ts');
const idFile = join(root, 'src/app/core/i18n/locales/id.json');
const enFile = join(root, 'src/app/core/i18n/locales/en.json');
const files = [componentFile, htmlFile, apiFile, modelFile, testFile];
if (files.some(file => existsSync(file))) {
  console.error('Feature already exists. No files were changed.');
  process.exit(1);
}
const routeSource = readFileSync(routesFile, 'utf8');
const marker = '  // FEATURE_ROUTE_ANCHOR';
if (!routeSource.includes(marker)) throw new Error('Route marker missing; generator refused to modify routes.');
const id = JSON.parse(readFileSync(idFile, 'utf8'));
const en = JSON.parse(readFileSync(enFile, 'utf8'));
const key = name.replace(/-([a-z])/g, (_match, character) => character.toUpperCase()) + 'Title';
if (key in id || key in en) throw new Error('i18n key already exists: ' + key);
id[key] = label; en[key] = label;
mkdirSync(feature, { recursive: true });
mkdirSync(templates, { recursive: true });

writeFileSync(componentFile, `import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';
@Component({
  templateUrl: '../../templates/${name}/${name}.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ${className}Page {
  readonly i18n = inject(I18nService);
}
`);
writeFileSync(htmlFile, `<section class="app-panel p-5 sm:p-6">
  <h1 class="text-2xl font-bold">{{ i18n.translate('${key}') }}</h1>
</section>
`);
writeFileSync(modelFile, `export interface ${className}Record {
  readonly id: string;
  readonly name: string;
}
`);
writeFileSync(apiFile, `import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PUBLIC_APP_CONFIG } from '../../core/config/app-config';
import { CursorPage, CursorQuery } from '../../core/http/api.types';
import { ${className}Record } from './${name}.types';
@Injectable({ providedIn: 'root' })
export class ${className}Api {
  private readonly http = inject(HttpClient);
  private readonly prefix = inject(PUBLIC_APP_CONFIG).apiPrefix;
  list(query: CursorQuery): Observable<CursorPage<${className}Record>> {
    // Integrate generated OpenAPI types and runtime validation before production use.
    return this.http.get<CursorPage<${className}Record>>(this.prefix + '/${name}', {
      params: { limit: query.limit, ...(query.cursor ? { cursor: query.cursor } : {}) },
    });
  }
}
`);
writeFileSync(testFile, `import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { ${className}Page } from './${name}.page';
describe('${className}Page', () => {
  it('renders the generated page', async () => {
    await TestBed.configureTestingModule({ imports: [${className}Page] }).compileComponents();
    const fixture = TestBed.createComponent(${className}Page);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('${label}');
  });
});
`);
const newRoute = `  { path: '${name}', canActivate: [authPermissionGuard],
    data: { permission: '${name}:read' },
    loadComponent: () => import('./features/${name}/${name}.page').then(m => m.${className}Page) },
`;
writeFileSync(routesFile, routeSource.replace(marker, newRoute + marker));
writeFileSync(idFile, JSON.stringify(id, null, 2) + '\n');
writeFileSync(enFile, JSON.stringify(en, null, 2) + '\n');
console.log('Generated feature: ' + name);
console.log('Translate ' + key + ' in id.json and en.json. Implement and validate your actual API.');
