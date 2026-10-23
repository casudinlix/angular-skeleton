import { Directive } from '@angular/core';
@Directive({
  selector: 'input[uiInput], select[uiInput], textarea[uiInput]',
  host: {
    class: 'w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-console-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-brand-400',
  },
})
export class UiInputDirective {}
