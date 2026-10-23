'use strict';
/**
 * Atomic Angular CLI schematic. No filesystem side effects until the Tree is committed.
 */
function feature(options) {
  return (tree) => {
    const name = options.name;
    if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(name)) {
      throw new Error('Feature name must use kebab-case.');
    }
    const className = name.split('-').map(part => part[0].toUpperCase() + part.slice(1)).join('');
    const title = className.replace(/([a-z])([A-Z])/g, '$1 $2');
    const key = name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()) + 'Title';
    const root = '/src/app';
    const prefix = root + '/features/' + name + '/' + name;
    const templatePath = root + '/templates/' + name + '/' + name + '.page.html';
    const pagePath = prefix + '.page.ts';
    const routesPath = root + '/app.routes.ts';
    const idPath = root + '/core/i18n/locales/id.json';
    const enPath = root + '/core/i18n/locales/en.json';
    if (tree.exists(pagePath) || tree.exists(templatePath)) throw new Error('Feature already exists.');
    const routes = tree.read(routesPath).toString('utf8');
    const marker = '  // FEATURE_ROUTE_ANCHOR';
    if (!routes.includes(marker)) throw new Error('Route marker is missing.');
    const id = JSON.parse(tree.read(idPath).toString('utf8'));
    const en = JSON.parse(tree.read(enPath).toString('utf8'));
    if (key in id || key in en) throw new Error('Translation key collision.');
    id[key] = title; en[key] = title;
    tree.create(pagePath, `import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';
@Component({
  templateUrl: '../../templates/${name}/${name}.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ${className}Page { readonly i18n = inject(I18nService); }
`);
    tree.create(templatePath, `<section><h1>{{ i18n.translate('${key}') }}</h1></section>\n`);
    tree.create(prefix + '.types.ts', `export interface ${className}Record { readonly id: string; readonly name: string; }\n`);
    tree.create(prefix + '.api.ts', `import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CursorPage } from '../../core/http/api.types';
@Injectable({ providedIn: 'root' })
export class ${className}Api {
  private readonly http = inject(HttpClient);
  list(): Observable<CursorPage<unknown>> {
    return this.http.get<CursorPage<unknown>>('/api/${name}');
  }
}
`);
    tree.create(prefix + '.page.spec.ts', `import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { ${className}Page } from './${name}.page';
describe('${className}Page', () => {
  it('renders', async () => {
    await TestBed.configureTestingModule({ imports: [${className}Page] }).compileComponents();
    const fixture = TestBed.createComponent(${className}Page);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('${title}');
  });
});
`);
    const route = `  { path: '${name}', canActivate: [authGuard, permissionGuard],
    data: { permission: '${name}:read' },
    loadComponent: () => import('./features/${name}/${name}.page').then(m => m.${className}Page) },
`;
    tree.overwrite(routesPath, routes.replace(marker, route + marker));
    tree.overwrite(idPath, JSON.stringify(id, null, 2) + '\n');
    tree.overwrite(enPath, JSON.stringify(en, null, 2) + '\n');
    return tree;
  };
}
module.exports = { feature };
