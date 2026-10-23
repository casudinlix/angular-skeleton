import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';
export type ThemePreference = 'light' | 'dark';
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly storage = this.document.defaultView?.localStorage;
  readonly theme = signal<ThemePreference>(this.storage?.getItem('skeleton.theme') === 'dark' ? 'dark' : 'light');
  constructor() { this.apply(); }
  toggle(): void {
    this.theme.update(current => current === 'dark' ? 'light' : 'dark');
    this.apply();
    try { this.storage?.setItem('skeleton.theme', this.theme()); } catch { /* optional storage */ }
  }
  private apply(): void { this.document.documentElement.classList.toggle('dark', this.theme() === 'dark'); }
}
