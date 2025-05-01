import { Routes } from '@angular/router';
import { OverlaysComponent } from '@pages/overlays/overlays.component';
import { ViewComponent } from '@pages/overlays/overlay/view/view.component';
import { HomeComponent } from '@pages/home/home.component';

export const routes: Routes = [
  {
    path: 'about',
    loadComponent: () => import('@pages/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'projects',
    loadComponent: () => import('@pages/projects/projects.component').then(m => m.ProjectsComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('@pages/contact/contact.component').then(m => m.ContactComponent)
  },
  { path: 'overlays',
    loadComponent: () => import('@pages/overlays/overlays.component').then(m => m.OverlaysComponent)
  },
  { path: 'overlays/:overlay_id',
    loadComponent: () => import('@pages/overlays/overlay/view/view.component').then(m => m.ViewComponent)
  },
  { path: '',
    loadComponent: () => import('@pages/home/home.component').then(m => m.HomeComponent)
  }
];
