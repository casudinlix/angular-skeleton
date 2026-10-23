import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { AuthService, SessionState } from './auth.service';
import { HasPermissionDirective } from './has-permission.directive';

@Component({
  imports: [HasPermissionDirective],
  templateUrl: '../../templates/auth/permission-host-test.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class PermissionHostComponent {}

describe('HasPermissionDirective', () => {
  it('shows permission-scoped controls only for an authenticated identity', async () => {
    const state = signal<SessionState>({ status: 'anonymous' });
    await TestBed.configureTestingModule({
      imports: [PermissionHostComponent],
      providers: [{ provide: AuthService, useValue: { state } }],
    }).compileComponents();
    const fixture = TestBed.createComponent(PermissionHostComponent);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('button')).toBeNull();
    state.set({
      status: 'authenticated',
      identity: { id: 'test', displayName: 'Test', permissions: ['customers:create'] },
    });
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('button')).not.toBeNull();
  });
});
