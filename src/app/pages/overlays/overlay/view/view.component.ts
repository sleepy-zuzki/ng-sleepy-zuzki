import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, ElementRef, OnInit, Signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
export class ViewComponent implements OnInit {
  overlays: Signal<Overlay[]>;
  currentOverlay: Overlay | null = null;
  currentLayout: LayoutModel | null = null;
  @ViewChild('streamerView') viewElement?: ElementRef;

  constructor (
    private route: ActivatedRoute,
    private apiService: GithubDataApiService,
    private overlayService: OverlayService
  ) {
    this.overlays = this.apiService.overlays;

    effect((): void => {
      if (this.overlays() && this.overlays().length > 0) {
        // Find the overlay for the specified streamer
        const streamer: string | null = this.route.snapshot.paramMap.get('overlay_id');
        if (streamer !== null) {
          this.currentOverlay = this.overlays().find((overlay: Overlay) => overlay.id === streamer) ?? null;

          if (this.currentOverlay) {
            // Actualizar el servicio con el overlay actual
            this.overlayService.setCurrentOverlay(this.currentOverlay);

            // Get the first layout from the overlay's layouts
            const layouts = this.currentOverlay.layouts;
            if (Array.isArray(layouts) && layouts.length > 0) {
              this.currentLayout = layouts[0];

              // Update the iframe source with the layout source URL
              if (this.viewElement && this.currentLayout) {
                this.viewElement.nativeElement.src = this.currentLayout.source;
              }
            }
          }
        }
      }
    })
  }

  ngOnInit(): void {
    const overlay_id: string | null = this.route.snapshot.paramMap.get('overlay_id');

    if (overlay_id !== null) {
      this.apiService.fetchOverlays();
    }
  }
}
