import { Directive } from '@angular/core';
@Directive({
  selector: 'dialog[uiDialog]',
  host: {
    class: 'm-auto max-h-[90vh] overflow-y-auto rounded-xl border border-slate-200 bg-white text-slate-900 shadow-2xl backdrop:bg-console-950/80 dark:border-slate-700 dark:bg-console-900 dark:text-slate-100',
  },
})
export class UiDialogDirective {}
