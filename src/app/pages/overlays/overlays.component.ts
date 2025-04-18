import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, Signal } from '@angular/core';
import { GithubDataApiService } from '@services/github-data-api.service';
import { Overlay } from '@core/models/overlay.model';
import { SkeletonComponent } from '@components/projects/project/skeleton/skeleton.component';
import { OverlayComponent } from '@components/overlays/overlay/overlay.component';
import { OverlayService } from '@services/overlay.service';
import { LoadState } from '@core/enums/load-state.enum';
import { ErrorMessage } from '@core/interfaces/error-message.interface';

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
  // Señales obtenidas del servicio
  overlays: Signal<Overlay[]>;
  loadState: Signal<LoadState>;
  errorInfo: Signal<ErrorMessage | null>;
  
  // Valores constantes para el enum LoadState, accesibles desde el template
  readonly LOAD_STATE = LoadState;

  constructor(
    private githubDataApi: GithubDataApiService,
    private overlayService: OverlayService
  ) {
    this.overlays = this.githubDataApi.overlays;
    this.loadState = this.githubDataApi.overlaysState;
    this.errorInfo = this.githubDataApi.overlaysError;
  }

  ngOnInit(): void {
    this.loadOverlays();
    this.overlayService.setCurrentOverlay(new Overlay());
  }

  /**
   * Carga los overlays usando el servicio de datos
   */
  loadOverlays(): void {
    this.githubDataApi.fetchOverlays();
  }

  /**
   * Reintentar la carga cuando hay errores
   */
  retry(): void {
    this.loadOverlays();
  }
}
