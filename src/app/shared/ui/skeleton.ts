import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';
@Component({
  selector: 'ui-skeleton',
  templateUrl: '../../templates/shared/skeleton.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiSkeleton {
  readonly i18n = inject(I18nService);
  readonly lines = input(3);
  readonly skeletonLines = computed(() => Array.from({ length: Math.min(Math.max(this.lines(), 1), 12) }, (_, index) => index));
}
