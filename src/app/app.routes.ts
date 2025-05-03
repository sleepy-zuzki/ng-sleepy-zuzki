import { Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: 'about',
    loadComponent: () => import('@pages/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'works',
    loadComponent: () => import('@pages/works/works.component').then(m => m.WorksComponent)
  },
  { path: '',
    loadComponent: () => import('@pages/home/home.component').then(m => m.HomeComponent)
  }
];
