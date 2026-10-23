import { Injectable, signal } from '@angular/core';
export type Language='id'|'en';
const labels={id:{dashboard:'Dasbor',customers:'Pelanggan'},en:{dashboard:'Dashboard',customers:'Customers'}} as const;
@Injectable({providedIn:'root'}) export class I18nService {readonly language=signal<Language>('id');translate(key:keyof typeof labels.id):string{return labels[this.language()][key];}setLanguage(language:Language):void{this.language.set(language);}}
