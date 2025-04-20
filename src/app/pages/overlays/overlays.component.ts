import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, Signal } from '@angular/core';
import { GithubDataApiService } from '@services/github-data-api.service';
import { Overlay } from '@core/models/overlay.model';
import { SkeletonComponent } from '@components/projects/project/skeleton/skeleton.component';
import { OverlayComponent } from '@components/overlays/overlay/overlay.component';
import { OverlayService } from '@services/overlay.service';
import { LoadState } from '@core/enums/load-state.enum';
import { ErrorMessage } from '@core/interfaces/error-message.interface';

/**
 * Página principal para mostrar la lista de overlays disponibles.
 * Gestiona la carga inicial de datos y muestra estados de carga o error.
 */
@Component({
  selector: 'app-overlays',
  imports: [
    SkeletonComponent,
    OverlayComponent
  ],
  templateUrl: './overlays.component.html',
  styleUrl: './overlays.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OverlaysComponent implements OnInit {
  /** Señal con la lista de overlays obtenidos del servicio. */
  overlays: Signal<Overlay[]>;
  /** Señal con el estado actual de la carga de overlays. */
  loadState: Signal<LoadState>;
  /** Señal con la información del error, si ocurrió durante la carga. */
  errorInfo: Signal<ErrorMessage | null>;

  /** Exporta el enum LoadState para usarlo en el template. */
  readonly LOAD_STATE = LoadState;

  /**
   * @param githubDataApi Servicio para obtener los datos de overlays.
   * @param overlayService Servicio para gestionar el estado del overlay seleccionado.
   */
  constructor(
    private githubDataApi: GithubDataApiService,
    private overlayService: OverlayService
  ) {
    // Vincula las señales locales a las señales expuestas por el servicio
    this.overlays = this.githubDataApi.overlays;
    this.loadState = this.githubDataApi.overlaysState;
    this.errorInfo = this.githubDataApi.overlaysError;
  }

  /**
   * Hook del ciclo de vida que se ejecuta al inicializar el componente.
   * Inicia la carga de overlays y resetea el overlay actual en el servicio.
   */
  ngOnInit(): void {
    this.loadOverlays();
    // Resetea el overlay actual al entrar en la página de listado
    this.overlayService.setCurrentOverlay(null);
  }

  /**
   * Solicita la carga de los overlays a través del servicio de datos.
   */
  loadOverlays(): void {
    this.githubDataApi.fetchOverlays();
  }

  /**
   * Permite reintentar la carga de overlays en caso de error.
   */
  retry(): void {
    this.loadOverlays();
  }
}
