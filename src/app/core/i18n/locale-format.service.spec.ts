import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { LocaleFormatService } from './locale-format.service';

describe('LocaleFormatService', () => {
  it('formats a timezone-qualified date and rejects invalid dates', () => {
    const formatter = TestBed.inject(LocaleFormatService);
    expect(formatter.dateTime('invalid')).toBe('—');
    expect(formatter.dateTime('2026-01-01T00:00:00Z').length).toBeGreaterThan(4);
  });
});
