import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, ElementRef, Signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { GithubDataApiService } from '@services/github-data-api.service';
import { Overlay } from '@core/models/overlay.model';
import { LayoutModel } from '@core/models/layout.model';
import { OverlayService } from '@services/overlay.service';

@Component({
  selector: 'app-view',
  imports: [],
  templateUrl: './view.component.html',
  styleUrl: './view.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ViewComponent {
  overlays: Signal<Overlay[]>;
  overlayId: Signal<string | null>;
  currentOverlay: Overlay | null = null;
  @ViewChild('streamerView') viewElement?: ElementRef;

  constructor (
    private route: ActivatedRoute,
    private apiService: GithubDataApiService,
    private overlayService: OverlayService
  ) {
    this.overlays = this.apiService.overlays;
    this.overlayId = toSignal(
      this.route.paramMap.pipe(map(params => params.get('overlay_id'))),
      { initialValue: null }
    );

    effect((): void => {
      const currentOverlayId: string | null = this.overlayId(); // Read the signal here
      const availableOverlays: Overlay[] = this.overlays(); // Read the signal here

      if (availableOverlays && availableOverlays.length > 0 && currentOverlayId !== null) {
        // Find the overlay using the reactive overlayId signal
        this.currentOverlay = availableOverlays.find(
          (overlay: Overlay) => overlay.id === currentOverlayId
        ) ?? null;

        if (this.currentOverlay) {
          // Actualizar el servicio con el overlay actual
          this.overlayService.setCurrentOverlay(this.currentOverlay);

          // Get the first layout from the overlay's layouts
          const layouts: LayoutModel[] = this.currentOverlay.layouts as LayoutModel[];
          if (Array.isArray(layouts) && layouts.length > 0) {
            this.overlayService.setOverlayLayouts(layouts);
            this.overlayService.setCurrentLayout(layouts[0]);
          }
        }
      }
    });

    effect((): void => {
      // Update the iframe source with the layout source URL
      // Note: overlayService.currentLayout() is already a signal
      const layout: LayoutModel | null = this.overlayService.currentLayout();
      if (this.viewElement && layout) {
        this.viewElement.nativeElement.src = layout.source;
      }
    });

    effect((): void => {
      const overlayId: string | null = this.overlayId();

      if (overlayId !== null) {
        this.apiService.fetchOverlays();
      }
    });
  }
}
