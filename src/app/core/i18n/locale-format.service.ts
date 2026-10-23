import { Injectable, inject } from '@angular/core';
import { I18nService } from './i18n.service';
import { PUBLIC_APP_CONFIG } from '../config/app-config';

@Injectable({ providedIn: 'root' })
export class LocaleFormatService {
  private readonly i18n = inject(I18nService);
  private readonly timezone = inject(PUBLIC_APP_CONFIG).timezone;
  dateTime(value: string | Date): string {
    const date = typeof value === 'string' ? new Date(value) : value;
    if (!Number.isFinite(date.getTime())) return '—';
    return new Intl.DateTimeFormat(this.i18n.locale(), {
      timeZone: this.timezone, dateStyle: 'medium', timeStyle: 'short',
    }).format(date);
  }
  number(value: number): string { return new Intl.NumberFormat(this.i18n.locale()).format(value); }
  currency(value: number, currency = 'IDR'): string {
    return new Intl.NumberFormat(this.i18n.locale(), { style: 'currency', currency }).format(value);
  }
}
