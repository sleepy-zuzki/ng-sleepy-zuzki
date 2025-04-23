import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LandingFeatureComponent } from '@features/landing/landing.feature';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    LandingFeatureComponent
  ],
  template: `<app-landing-feature/>`,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
/**
 * Componente que representa la página de inicio (Landing Page) de la aplicación.
 * Actúa como contenedor de layout para la característica de landing.
 */
export class LandingComponent {
  // Logic moved to LandingFeatureComponent
}
