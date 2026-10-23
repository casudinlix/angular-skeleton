import { Directive } from '@angular/core';
@Directive({
  selector: 'table[uiDataTable]',
  host: { class: 'w-full border-collapse text-left text-sm' },
})
export class UiDataTableDirective {}
