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
      const currentOverlayId: string | null = this.overlayId();
      const availableOverlays: Overlay[] = this.overlays();

      if (availableOverlays && availableOverlays.length > 0 && currentOverlayId !== null) {
        this.currentOverlay = availableOverlays.find(
          (overlay: Overlay) => overlay.id === currentOverlayId
        ) ?? null;

        // Set the overlay in the service (this handles setting layouts too)
        this.overlayService.setCurrentOverlay(this.currentOverlay);

        if (this.currentOverlay) {
          // Get layouts *from the service* after setting the overlay
          const layouts = this.overlayService.overlayLayouts();
          if (layouts.length > 0) {
             // Set the first layout as the current one initially
            this.overlayService.setCurrentLayout(layouts[0]);
          } else {
            // Ensure currentLayout is null if no layouts exist for this overlay
            this.overlayService.setCurrentLayout(null);
          }
        }
        // No 'else' needed here for setting service state,
        // because setCurrentOverlay(null) handles clearing layouts.
        // We might still want an else for local component state if needed.

      } else if (currentOverlayId === null) {
         // Optional: Handle case where route parameter is null explicitly if needed
         // For now, setCurrentOverlay(null) covers this implicitly if find returns null
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
