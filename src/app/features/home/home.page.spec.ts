import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { HomePage } from './home.page';

describe('HomePage', () => {
  it('updates its signal counter', async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(HomePage);
    expect(fixture.componentInstance.count()).toBe(0);
    fixture.componentInstance.count.update(value => value + 1);
    fixture.detectChanges();
    expect(fixture.componentInstance.count()).toBe(1);
  });
});
