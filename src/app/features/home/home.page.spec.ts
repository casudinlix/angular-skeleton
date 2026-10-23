import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { HomePage } from './home.page';

describe('HomePage', () => {
  it('updates the signal counter', async () => {
    await TestBed.configureTestingModule({ imports: [HomePage] }).compileComponents();
    const fixture = TestBed.createComponent(HomePage);
    expect(fixture.componentInstance.count()).toBe(0);
    fixture.componentInstance.count.update((value) => value + 1);
    fixture.detectChanges();
    expect(fixture.componentInstance.count()).toBe(1);
  });
});
