import { computed, Directive, input } from '@angular/core';
export type ButtonVariant = 'primary' | 'secondary' | 'danger';
const variants: Record<ButtonVariant, string> = {
  primary: 'border-brand-600 bg-brand-600 text-white hover:bg-brand-700',
  secondary: 'border-slate-300 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
  danger: 'border-red-600 bg-red-600 text-white hover:bg-red-700',
};
@Directive({
  selector: 'button[uiButton], a[uiButton]',
  host: {
    class: 'inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
    '[class]': 'variantClasses()',
  },
})
export class UiButtonDirective {
  readonly variant = input<ButtonVariant>('primary', { alias: 'uiButton' });
  readonly variantClasses = computed(() => variants[this.variant()]);
}
