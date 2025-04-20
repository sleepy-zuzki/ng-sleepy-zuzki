import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, ElementRef, Signal, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { GithubDataApiService } from '@services/github-data-api.service';
import { Overlay } from '@core/models/overlay.model';
import { LayoutModel } from '@core/models/layout.model';
import { OverlayService } from '@services/overlay.service';

/**
 * Componente para visualizar un layout específico de un overlay.
 * Obtiene el ID del overlay de la ruta y utiliza OverlayService para
 * determinar qué layout mostrar en un iframe.
 */
@Component({
  selector: 'app-view',
  imports: [],
  templateUrl: './view.component.html',
  styleUrl: './view.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ViewComponent implements AfterViewInit {
  /** Señal con la lista completa de overlays disponibles. */
  overlays: Signal<Overlay[]>;
  /** Señal con el ID del overlay obtenido de los parámetros de la ruta. */
  overlayId: Signal<string | null>;
  /** Overlay actualmente seleccionado basado en overlayId. */
  currentOverlay: Overlay | null = null;
  /** Referencia al elemento iframe donde se muestra el layout. */
  @ViewChild('streamerView') viewElement?: ElementRef<HTMLIFrameElement>; // Tipado específico para iframe

  /**
   * @param route Servicio para acceder a los parámetros de la ruta activa.
   * @param apiService Servicio para obtener datos de la API.
   * @param overlayService Servicio para gestionar el estado del overlay/layout.
   */
  constructor (
    private route: ActivatedRoute,
    private apiService: GithubDataApiService,
    private overlayService: OverlayService
  ) {
    this.overlays = this.apiService.overlays;
    // Convierte el observable de parámetros de ruta a una señal
    this.overlayId = toSignal(
      this.route.paramMap.pipe(map(params => params.get('overlay_id'))),
      { initialValue: null }
    );

    /**
     * Efecto que reacciona a cambios en el ID del overlay de la ruta o en la lista de overlays.
     * Busca el overlay correspondiente, lo establece en OverlayService y selecciona
     * el primer layout disponible para ese overlay.
     * Si no se encuentra el overlay o no hay ID, resetea el servicio y recarga los overlays.
     */
    effect((): void => {
      const currentOverlayId: string | null = this.overlayId();
      const availableOverlays: Overlay[] = this.overlays();

      if (availableOverlays && availableOverlays.length > 0 && currentOverlayId !== null) {
        this.currentOverlay = availableOverlays.find(
          (overlay: Overlay) => overlay.id === currentOverlayId
        ) ?? null;

        this.overlayService.setCurrentOverlay(this.currentOverlay);

        // Si se encontró el overlay, intentar establecer su primer layout
        if (this.currentOverlay && Array.isArray(this.currentOverlay.layouts)) {
          const layouts = this.currentOverlay.layouts as LayoutModel[];
          this.overlayService.setCurrentLayout(layouts.length > 0 ? layouts[0] : null);
        } else {
          this.overlayService.setCurrentLayout(null);
        }
      } else {
         // Si no hay overlays disponibles o no hay ID en la ruta, resetear
         this.overlayService.setCurrentOverlay(null);
         this.overlayService.setCurrentLayout(null); // Asegurar que el layout también se resetea
         this.currentOverlay = null;
         // Intentar recargar si no hay overlays cargados aún
         if (!availableOverlays || availableOverlays.length === 0) {
            this.apiService.fetchOverlays();
         }
      }
    });

    /**
     * Efecto que reacciona a cambios en el layout actual seleccionado en OverlayService.
     * Actualiza el atributo 'src' del iframe para mostrar el nuevo layout.
     */
    effect(() => {
      const layout = this.overlayService.currentLayout();
      const element = this.viewElement?.nativeElement;

      if (element) {
        element.src = layout ? layout.source : 'about:blank';
      }
    });

  }

  /**
   * Hook del ciclo de vida que se ejecuta después de que la vista del componente se inicializa.
   * Establece el 'src' inicial del iframe basado en el layout actual al cargar.
   */
  ngAfterViewInit(): void {
    // Set the initial src once the view is ready
    const initialLayout: LayoutModel | null = this.overlayService.currentLayout();
    if (this.viewElement && initialLayout) {
      this.viewElement.nativeElement.src = initialLayout.source;
    } else if (this.viewElement) {
        // Asegurar que el src inicial también se limpie correctamente
        this.viewElement.nativeElement.src = 'about:blank';
    }
  }
}
