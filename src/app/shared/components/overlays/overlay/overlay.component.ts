import { Component, CUSTOM_ELEMENTS_SCHEMA, input, InputSignal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Overlay } from '@core/models/overlay.model';
import { OverlayService } from '@services/overlay.service';

/**
 * Componente para mostrar la tarjeta de un overlay individual.
 * Permite visualizar información básica y seleccionar el overlay para ver sus layouts.
 */
@Component({
  selector: 'app-overlay',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OverlayComponent {
  /**
   * Datos del overlay a mostrar.
   * Se recibe como una señal de entrada (InputSignal).
   */
  readonly overlay: InputSignal<Overlay | undefined> = input<Overlay>();

  /**
   * @param overlayService Servicio para gestionar el estado del overlay/layout actual.
   */
  constructor(private overlayService: OverlayService) { }

  /**
   * Obtiene el nombre del creador del overlay.
   * Maneja casos donde el creador es un string (ID) o un objeto Creator.
   * @returns El nombre del creador o una cadena vacía si no está disponible.
   */
  getOverlayCreator (): string {
    const currOverlay: Overlay | undefined = this.overlay();

    if (!currOverlay || !currOverlay.creator) {
      return '';
    }

    return typeof currOverlay.creator === 'string'
      ? currOverlay.creator // Devuelve el ID si es string
      : currOverlay.creator.name; // Devuelve el nombre si es objeto Creator
  }

  /**
   * Establece el overlay actual y su primer layout (si existe) en el OverlayService
   * al hacer clic en la tarjeta.
   */
  changeLayout(): void {
    const overlay: Overlay | undefined = this.overlay();
    if (overlay) {
      this.overlayService.setCurrentOverlay(overlay);
      // Establece el primer layout como activo por defecto al seleccionar el overlay
      if (Array.isArray(overlay.layouts) && overlay.layouts.length > 0) {
        this.overlayService.setCurrentLayout(overlay.layouts[0]);
      }
    }
  }
}
