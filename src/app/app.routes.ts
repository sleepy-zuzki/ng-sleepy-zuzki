import { Routes } from '@angular/router';
import { LandingComponent } from '@pages/landing/landing.component';
import { OverlaysComponent } from '@pages/overlays/overlays.component';
import { KiraryeComponent } from '@pages/overlays/overlay/kirarye/kirarye.component';

export const routes: Routes = [
  { path: 'overlays', component: OverlaysComponent },
  { path: 'overlays/:streamer', component: KiraryeComponent },
  { path: '', component: LandingComponent }
];
