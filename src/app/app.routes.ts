import { Routes } from '@angular/router';
import { LandingComponent } from '@components/landing/landing.component';
import { OverlaysComponent } from '@components/overlays/overlays.component';
import { KiraryeComponent } from '@components/overlays/overlay/kirarye/kirarye.component';

export const routes: Routes = [
  { path: 'overlays', component: OverlaysComponent },
  { path: 'overlays/:streamer', component: KiraryeComponent },
  { path: '', component: LandingComponent }
];
