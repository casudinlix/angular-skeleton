import { ChangeDetectionStrategy, Component, input } from '@angular/core';
@Component({
  selector: 'ui-empty-state',
  templateUrl: '../../templates/shared/empty-state.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiEmptyState {
  readonly title = input.required<string>();
  readonly description = input<string>('');
}
