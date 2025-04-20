import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA, effect,
  ElementRef,
  Signal,
  ViewChild
} from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Overlay } from '@core/models/overlay.model';
import { GithubDataApiService } from '@services/github-data-api.service';
import { LayoutModel } from '@core/models/layout.model';
import { OverlayService } from '@services/overlay.service';

/**
 * Componente raíz de la aplicación.
 */
@Component({
  selector: 'app-root',
    imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  /** Referencia al elemento del cajón lateral (drawer). */
  @ViewChild('drawer') drawer?: ElementRef;
  /** Título de la aplicación. */
  title: string = 'Sleepy Zuzki';
  /** Señal que contiene la lista de overlays disponibles. */
  readonly overlays: Signal<Overlay[]>;

  /**
   * @param apiService Servicio para interactuar con la API de datos de GitHub.
   * @param overlayService Servicio para gestionar el estado de los overlays y layouts.
   */
  constructor (
    readonly apiService: GithubDataApiService,
    readonly overlayService: OverlayService
  ) {
    this.overlays = this.apiService.overlays;
  }

  /**
   * Abre el cajón lateral.
   */
  openDrawer(): void {
    if (this.drawer) {
      this.drawer.nativeElement.open = true;
    }
  }

  /**
   * Cierra el cajón lateral.
   */
  closeDrawer(): void {
    if (this.drawer) {
      this.drawer.nativeElement.open = false;
    }
  }

  /**
   * Cambia el layout actual del overlay seleccionado.
   * @param layout_id El ID del layout a establecer como actual.
   */
  changeLayout(layout_id: string): void {
    const reqLayout: LayoutModel | undefined = this.overlayService.overlayLayouts().find((layout: LayoutModel) => layout.id === layout_id);
    if (reqLayout) {
      this.overlayService.setCurrentLayout(reqLayout);
      this.closeDrawer();
    }
  }
}
