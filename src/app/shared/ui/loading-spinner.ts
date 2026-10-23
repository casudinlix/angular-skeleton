import { ChangeDetectionStrategy, Component, input } from '@angular/core';
@Component({
  selector: 'ui-loading-spinner',
  templateUrl: '../../templates/shared/loading-spinner.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiLoadingSpinner {
  readonly label = input<string>('Loading');
}
