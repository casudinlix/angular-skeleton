import { ChangeDetectionStrategy, Component, input } from '@angular/core';
@Component({
  selector: 'ui-skeleton',
  templateUrl: '../../templates/shared/skeleton.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiSkeleton {
  readonly lines = input(3);
}
