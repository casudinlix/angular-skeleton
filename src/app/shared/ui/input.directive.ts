import { Directive } from '@angular/core';
@Directive({
  selector: 'input[uiInput], select[uiInput], textarea[uiInput]',
  host: { class: 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white' },
})
export class UiInputDirective {}
