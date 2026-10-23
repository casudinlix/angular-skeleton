import { Routes } from '@angular/router';
export const routes:Routes=[{path:'',loadComponent:()=>import('./features/home/home.page').then(m=>m.HomePage)},{path:'customers',loadComponent:()=>import('./features/customers/customers.page').then(m=>m.CustomersPage)},{path:'**',loadComponent:()=>import('./features/errors/not-found.page').then(m=>m.NotFoundPage)}];
