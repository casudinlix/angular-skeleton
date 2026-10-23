import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface BreadcrumbItem {
  readonly label: string;
  readonly url?: string;
}

@Component({
  selector: 'ui-breadcrumbs',
  imports: [RouterLink],
  templateUrl: '../../templates/shared/breadcrumbs.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiBreadcrumbs {
  readonly items = input.required<readonly BreadcrumbItem[]>();
}
