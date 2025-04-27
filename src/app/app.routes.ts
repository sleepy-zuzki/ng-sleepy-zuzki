import { Routes } from '@angular/router';
import { OverlaysComponent } from '@pages/overlays/overlays.component';
import { ViewComponent } from '@pages/overlays/overlay/view/view.component';
import { HomeComponent } from '@pages/home/home.component';

export const routes: Routes = [
  { path: 'overlays', component: OverlaysComponent },
  { path: 'overlays/:overlay_id', component: ViewComponent },
  { path: '', component: HomeComponent }
];
