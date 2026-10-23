import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';
import idMessages from './locales/id.json';
import enMessages from './locales/en.json';

export type Language = 'id' | 'en';
export type TranslationKey = keyof typeof idMessages;

// Missing translation keys are rejected by TypeScript during compilation.
const messages: Record<Language, Record<TranslationKey, string>> = {
  id: idMessages,
  en: enMessages,
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly document = inject(DOCUMENT);

  readonly language = signal<Language>('id');

  translate(key: TranslationKey): string {
    return messages[this.language()][key];
  }

  setLanguage(language: Language): void {
    this.language.set(language);
    this.document.documentElement.lang = language;
  }
}
