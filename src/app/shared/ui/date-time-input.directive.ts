import { Directive } from '@angular/core';

/** Native browser picker. Caller must interpret datetime-local in an explicit timezone. */
@Directive({
  selector: 'input[uiDateTime]',
  host: {
    type: 'datetime-local',
    class: 'app-touch-target w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 dark:border-slate-700 dark:bg-console-950 dark:text-slate-100',
  },
})
export class UiDateTimeInputDirective {}
