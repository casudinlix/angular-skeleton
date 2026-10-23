import { Directive } from '@angular/core';
@Directive({
  selector: 'dialog[uiDialog]',
  host: { class: 'm-auto max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl backdrop:bg-slate-950/60 dark:border-slate-700 dark:bg-slate-900 dark:text-white' },
})
export class UiDialogDirective {}
