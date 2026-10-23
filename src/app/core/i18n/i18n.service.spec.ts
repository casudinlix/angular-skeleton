import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { I18nService } from './i18n.service';

describe('I18nService', () => {
  it('switches the active language', () => {
    const i18n = TestBed.inject(I18nService);
    i18n.setLanguage('id');
    expect(i18n.translate('customersTitle')).toBe('Pelanggan');
    i18n.setLanguage('en');
    expect(i18n.translate('customersTitle')).toBe('Customers');
  });
});
