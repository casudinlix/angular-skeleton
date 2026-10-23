import { InjectionToken } from '@angular/core';
export interface PublicAppConfig {
  readonly apiPrefix: '/api';
  readonly appTitle: string;
  readonly timezone: string;
}
export const PUBLIC_APP_CONFIG = new InjectionToken<PublicAppConfig>('PUBLIC_APP_CONFIG', {
  providedIn: 'root',
  factory: () => ({ apiPrefix: '/api', appTitle: 'Angular Skeleton', timezone: 'Asia/Jakarta' }),
});
