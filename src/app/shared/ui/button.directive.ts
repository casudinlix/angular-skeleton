import { Directive, input } from '@angular/core';
export type ButtonVariant = 'primary' | 'secondary' | 'danger';
@Directive({
  selector: 'button[uiButton], a[uiButton]',
  host: {
    class: 'inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    '[class.bg-brand-600]': "variant() === 'primary'",
    '[class.hover:bg-brand-700]': "variant() === 'primary'",
    '[class.text-white]': "variant() !== 'secondary'",
    '[class.border-brand-600]': "variant() === 'primary'",
    '[class.border-slate-300]': "variant() === 'secondary'",
    '[class.bg-white]': "variant() === 'secondary'",
    '[class.text-slate-900]': "variant() === 'secondary'",
    '[class.dark:bg-slate-800]': "variant() === 'secondary'",
    '[class.dark:text-slate-100]': "variant() === 'secondary'",
    '[class.bg-red-600]': "variant() === 'danger'",
    '[class.border-red-600]': "variant() === 'danger'",
    '[class.hover:bg-red-700]': "variant() === 'danger'",
  },
})
export class UiButtonDirective {
  readonly variant = input<ButtonVariant>('primary', { alias: 'uiButton' });
}
