import { computed, Directive, input } from '@angular/core';
export type ButtonVariant = 'primary' | 'secondary' | 'danger';
const variants: Record<ButtonVariant, string> = {
  primary: 'border-brand-600 bg-brand-600 text-white hover:bg-brand-700 dark:border-brand-400 dark:bg-brand-400 dark:text-console-950 dark:hover:bg-brand-300',
  secondary: 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-console-850 dark:text-slate-100 dark:hover:bg-slate-800',
  danger: 'border-red-600 bg-red-600 text-white hover:bg-red-700 dark:border-red-500 dark:bg-red-500 dark:text-white dark:hover:bg-red-600',
};
@Directive({
  selector: 'button[uiButton], a[uiButton]',
  host: {
    class: 'app-touch-target inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
    '[class]': 'variantClasses()',
  },
})
export class UiButtonDirective {
  readonly variant = input<ButtonVariant>('primary', { alias: 'uiButton' });
  readonly variantClasses = computed(() => variants[this.variant()]);
}
