import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { ProjectsComponent } from '@components/projects/projects.component';
import { SocialsComponent } from '@components/socials/socials.component';
import { OverlayService } from '@services/overlay.service';

@Component({
  selector: 'app-landing-feature',
  standalone: true,
  imports: [
    ProjectsComponent,
    SocialsComponent
  ],
  templateUrl: './landing.feature.html',
  styleUrl: './landing.feature.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
/**
 * Componente que representa la característica de la página de inicio (Landing Page) de la aplicación.
 * Muestra componentes como Proyectos y Redes Sociales.
 */
export class LandingFeatureComponent implements OnInit {

  /**
   * @param overlayService Servicio para gestionar el estado del overlay seleccionado.
   */
  constructor(private overlayService: OverlayService) { }

  /**
   * Hook del ciclo de vida que se ejecuta al inicializar el componente.
   * Resetea el overlay actual en el servicio al cargar la página de inicio.
   */
  ngOnInit(): void {
    // Asegura que no haya ningún overlay seleccionado al mostrar la landing page
    this.overlayService.setCurrentOverlay(null);
  }

} 