import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA, effect,
  ElementRef,
  OnInit,
  Signal,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Overlay } from '@core/models/overlay.model';
import { GithubDataApiService } from '@services/github-data-api.service';
import { LayoutModel } from '@core/models/layout.model';
import { OverlayService } from '@services/overlay.service';

@Component({
  selector: 'app-root',
    imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  @ViewChild('drawer') drawer?: ElementRef;
  title: string = 'Sleepy Zuzki';
  currentOverlay: Overlay = new Overlay();
  overlayLayouts: LayoutModel[] | string = [];
  readonly overlays: Signal<Overlay[]>;

  constructor (
    private route: ActivatedRoute,
    readonly apiService: GithubDataApiService,
    readonly overlayService: OverlayService
  ) {
    this.overlays = this.apiService.overlays;

    effect(() => {
      if (this.overlays() && this.overlays().length > 0) {
        // Find the overlay
        const overlay_id: string | null = this.route.snapshot.paramMap.get('overlay_id');
        if (overlay_id !== null) {
          const overlay: Overlay | undefined = this.overlays().find(overlay => overlay.id === overlay_id);
          if (overlay) {
            this.currentOverlay = overlay;
            if (this.currentOverlay.layouts !== 'string') {
              this.overlayLayouts = this.currentOverlay.layouts;
            }
          }
        }
      }
    });
  }

  openDrawer(): void {
    if (this.drawer) {
      this.drawer.nativeElement.open = true;
    }
  }
}
