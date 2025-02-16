import { Routes } from '@angular/router';
import { LandingComponent } from '@pages/landing/landing.component';
import { OverlaysComponent } from '@pages/overlays/overlays.component';
import { ViewComponent } from '@pages/overlays/overlay/view/view.component';

export const routes: Routes = [
  { path: 'overlays', component: OverlaysComponent },
  { path: 'overlays/:streamer', component: ViewComponent },
  { path: '', component: LandingComponent }
];
