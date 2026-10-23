import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { PreferenceStorage } from './preference-storage';

describe('PreferenceStorage', () => {
  it('survives SecurityError when localStorage is blocked', () => {
    const windowLike = Object.defineProperty({}, 'localStorage', {
      get() { throw new DOMException('Blocked', 'SecurityError'); },
    });
    TestBed.configureTestingModule({
      providers: [{ provide: DOCUMENT, useValue: { defaultView: windowLike } }],
    });
    const storage = TestBed.inject(PreferenceStorage);
    expect(storage.read('skeleton.theme')).toBeNull();
    expect(() => storage.write('skeleton.theme', 'dark')).not.toThrow();
  });
});
