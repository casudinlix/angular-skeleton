import { DOCUMENT } from '@angular/common';
import { computed, inject, Injectable, signal } from '@angular/core';
import { PreferenceStorage } from '../config/preference-storage';
import idMessages from './locales/id.json';
import enMessages from './locales/en.json';

export type Language = 'id' | 'en';
export type TranslationKey = keyof typeof idMessages;
const dictionaries: Record<Language, Record<TranslationKey, string>> = {
  id: idMessages,
  en: enMessages,
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly document = inject(DOCUMENT);
  private readonly storage = inject(PreferenceStorage);

  readonly language = signal<Language>(
    this.storage.read('skeleton.language') === 'en' ? 'en' : 'id',
  );
  readonly locale = computed(() => this.language() === 'id' ? 'id-ID' : 'en-US');

  constructor() {
    this.document.documentElement.lang = this.language();
  }

  translate(key: TranslationKey): string {
    return dictionaries[this.language()][key] || dictionaries.id[key];
  }

  setLanguage(value: Language): void {
    this.language.set(value);
    this.document.documentElement.lang = value;
    this.storage.write('skeleton.language', value);
  }
}
