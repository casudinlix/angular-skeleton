import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

/** Browser preferences only. Never store credentials or session information here. */
@Injectable({ providedIn: 'root' })
export class PreferenceStorage {
  private readonly document = inject(DOCUMENT);

  read(key: string): string | null {
    try {
      return this.document.defaultView?.localStorage.getItem(key) ?? null;
    } catch {
      // SecurityError may occur in private browsing, sandboxed frames or blocked storage.
      return null;
    }
  }

  write(key: string, value: string): void {
    try {
      this.document.defaultView?.localStorage.setItem(key, value);
    } catch {
      // Preference persistence is optional, never fatal to app rendering.
    }
  }
}
