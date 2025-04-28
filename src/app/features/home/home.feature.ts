import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { OverlayService } from '@services/overlay.service';
import { ButtonComponent } from '@components/ui/button/button.component';

@Component({
  selector: 'app-home-feature',
  standalone: true,
  imports: [
    ButtonComponent
  ],
  templateUrl: './home.feature.html',
  styleUrl: './home.feature.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
/**
 * Componente que representa la característica de la página de inicio (Home Page) de la aplicación.
 * Muestra componentes como Proyectos y Redes Sociales.
 */
export class HomeFeatureComponent implements OnInit {

  /**
   * @param overlayService Servicio para gestionar el estado del overlay seleccionado.
   */
  constructor(private overlayService: OverlayService) { }

  /**
   * Hook del ciclo de vida que se ejecuta al inicializar el componente.
   * Resetea el overlay actual en el servicio al cargar la página de inicio.
   */
  ngOnInit(): void {
    // Asegura que no haya ningún overlay seleccionado al mostrar la página de inicio
    this.overlayService.setCurrentOverlay(null);
  }

}
