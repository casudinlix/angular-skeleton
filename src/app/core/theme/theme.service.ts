import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';
import { PreferenceStorage } from '../config/preference-storage';

export type ThemePreference = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly storage = inject(PreferenceStorage);
  readonly theme = signal<ThemePreference>(
    this.storage.read('skeleton.theme') === 'dark' ? 'dark' : 'light',
  );

  constructor() { this.apply(); }

  toggle(): void {
    this.theme.update(current => current === 'dark' ? 'light' : 'dark');
    this.apply();
    this.storage.write('skeleton.theme', this.theme());
  }

  private apply(): void {
    this.document.documentElement.classList.toggle('dark', this.theme() === 'dark');
  }
}
