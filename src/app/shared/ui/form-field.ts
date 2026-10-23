import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ui-form-field',
  host: { class: 'block min-w-0' },
  templateUrl: '../../templates/shared/form-field.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiFormField {
  readonly controlId = input.required<string>();
  readonly label = input.required<string>();
  readonly hint = input<string>('');
  readonly error = input<string>('');
  readonly required = input(false);
}
