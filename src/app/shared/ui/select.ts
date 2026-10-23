import {
  ChangeDetectionStrategy, Component, forwardRef, input, signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface UiSelectOption {
  readonly value: string;
  readonly label: string;
}

@Component({
  selector: 'ui-select',
  templateUrl: '../../templates/shared/select.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UiSelect),
    multi: true,
  }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiSelect implements ControlValueAccessor {
  readonly controlId = input.required<string>();
  readonly options = input<readonly UiSelectOption[]>([]);
  readonly placeholder = input<string>('');
  readonly describedBy = input<string | null>(null);

  readonly value = signal('');
  readonly disabled = signal(false);
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string | null): void { this.value.set(value ?? ''); }
  registerOnChange(handler: (value: string) => void): void { this.onChange = handler; }
  registerOnTouched(handler: () => void): void { this.onTouched = handler; }
  setDisabledState(disabled: boolean): void { this.disabled.set(disabled); }

  change(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.value.set(value);
    this.onChange(value);
  }

  touched(): void { this.onTouched(); }
}
