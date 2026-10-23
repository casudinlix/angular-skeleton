import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
@Component({
  selector: 'ui-skeleton',
  templateUrl: '../../templates/shared/skeleton.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiSkeleton {
  readonly lines = input(3);
  readonly skeletonLines = computed(() => Array.from({ length: Math.min(Math.max(this.lines(), 1), 12) }, (_, index) => index));
}
