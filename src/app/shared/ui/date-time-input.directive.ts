import { Directive } from '@angular/core';

/**
 * Style a native browser date/time control, preserving platform keyboard and accessibility.
 * datetime-local has no timezone: the feature MUST interpret it in an explicit user timezone
 * before sending a timezone-qualified ISO 8601 timestamp to its API.
 */
@Directive({
  selector: 'input[uiDateTime]',
  host: {
    type: 'datetime-local',
    class: 'app-touch-target w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white',
  },
})
export class UiDateTimeInputDirective {}
