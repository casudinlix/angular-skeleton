import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({imports:[RouterLink],changeDetection:ChangeDetectionStrategy.OnPush,template:'<main><h1>404</h1><p>Page not found</p><a routerLink="/">Home</a></main>'})
export class NotFoundPage {}
