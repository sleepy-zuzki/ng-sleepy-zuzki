import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, ElementRef, Signal, ViewChild, AfterViewInit } from '@angular/core'; // Re-added AfterViewInit
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
export class ViewComponent implements AfterViewInit { // Added implements AfterViewInit
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

    // Effect 1: Set current overlay based on route and available overlays
    effect((): void => {
      const currentOverlayId: string | null = this.overlayId();
      const availableOverlays: Overlay[] = this.overlays();

      if (availableOverlays && availableOverlays.length > 0 && currentOverlayId !== null) {
        this.currentOverlay = availableOverlays.find(
          (overlay: Overlay) => overlay.id === currentOverlayId
        ) ?? null;

        this.overlayService.setCurrentOverlay(this.currentOverlay);

        if (this.currentOverlay) {
          const layouts = this.overlayService.overlayLayouts();
          if (layouts.length > 0) {
            this.overlayService.setCurrentLayout(layouts[0]);
          } else {
            this.overlayService.setCurrentLayout(null);
          }
        }
      } else {
         this.overlayService.setCurrentOverlay(null);
         this.currentOverlay = null;
         this.apiService.fetchOverlays();
      }
    });

    // Effect 2: Update iframe source based on current layout
    effect((): void => {
      const layout: LayoutModel | null = this.overlayService.currentLayout();
      if (this.viewElement && layout) {
        this.viewElement.nativeElement.src = layout.source;
      }
    });
  }

  ngAfterViewInit(): void {
    // Set the initial src once the view is ready
    const initialLayout: LayoutModel | null = this.overlayService.currentLayout();
    if (this.viewElement && initialLayout) {
      this.viewElement.nativeElement.src = initialLayout.source;
    }
  }
}
