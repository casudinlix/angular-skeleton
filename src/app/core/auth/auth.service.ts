import { Injectable, signal } from '@angular/core';
export interface Identity {readonly id:string;readonly displayName:string;readonly permissions:readonly string[];}
/** Client view only; real authentication requires a backend-verified session. */
@Injectable({providedIn:'root'}) export class AuthService {private readonly identityState=signal<Identity|null>(null);readonly identity=this.identityState.asReadonly();setIdentity(identity:Identity|null):void{this.identityState.set(identity);}has(permission:string):boolean{return this.identity()?.permissions.includes(permission)??false;}}
