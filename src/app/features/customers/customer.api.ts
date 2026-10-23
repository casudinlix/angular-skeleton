import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CursorPage, CursorQuery } from '../../core/http/api.types';
import { Customer } from './customer.types';
@Injectable({providedIn:'root'}) export class CustomerApi {private readonly http=inject(HttpClient);list(query:CursorQuery):Observable<CursorPage<Customer>>{let params=new HttpParams().set('limit',query.limit);if(query.cursor)params=params.set('cursor',query.cursor);if(query.search)params=params.set('search',query.search);return this.http.get<CursorPage<Customer>>('/api/customers',{params,withCredentials:true});}}
