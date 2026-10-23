import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
export const config:ApplicationConfig={providers:[provideZonelessChangeDetection(),provideRouter(routes),provideHttpClient()]};
