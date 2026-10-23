import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { UiSelect } from './select';

describe('UiSelect ControlValueAccessor', () => {
  it('stores incoming values and delegates user changes', async () => {
    await TestBed.configureTestingModule({ imports: [UiSelect] }).compileComponents();
    const fixture = TestBed.createComponent(UiSelect);
    fixture.componentRef.setInput('controlId', 'status');
    fixture.componentRef.setInput('options', [{ value: 'active', label: 'Active' }]);
    fixture.componentInstance.writeValue('active');
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('active');
    let selected = '';
    fixture.componentInstance.registerOnChange(value => { selected = value; });
    const control = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    control.value = 'active';
    control.dispatchEvent(new Event('change', { bubbles: true }));
    expect(selected).toBe('active');
    fixture.componentInstance.setDisabledState(true);
    fixture.detectChanges();
    expect(control.disabled).toBe(true);
  });
});
