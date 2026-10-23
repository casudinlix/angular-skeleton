import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
@Component({changeDetection:ChangeDetectionStrategy.OnPush,template:'<main style="max-width:900px;margin:8vh auto;padding:32px;background:white;border-radius:16px"><small>ANGULAR SKELETON</small><h1>Enterprise application foundation</h1><p>Standalone components, lazy routes, signals and strict TypeScript.</p><button (click)="count.update(n=>n+1)">Signal counter: {{count()}}</button></main>'})
export class HomePage {readonly count=signal(0);}
