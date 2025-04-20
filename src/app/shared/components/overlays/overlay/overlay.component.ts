import { Component, CUSTOM_ELEMENTS_SCHEMA, input, InputSignal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Overlay } from '@core/models/overlay.model';
import { OverlayService } from '@services/overlay.service';

@Component({
  selector: 'app-overlay',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OverlayComponent {
  readonly overlay: InputSignal<Overlay | undefined> = input<Overlay>();

  constructor(private overlayService: OverlayService) { }

  getOverlayCreator (): string {
    const currOverlay: Overlay | undefined = this.overlay();

    if (!currOverlay) return '';

    if (!currOverlay.creator) return '';

    if (typeof currOverlay.creator === 'string') return currOverlay.creator;

    return currOverlay.creator.name;
  }

  changeLayout(): void {
    const overlay: Overlay | undefined = this.overlay();
    if (overlay) {
      this.overlayService.setCurrentOverlay(overlay);
      if (Array.isArray(overlay.layouts) && overlay.layouts.length > 0) {
        this.overlayService.setCurrentLayout(overlay.layouts[0]);
      }
    }
  }
}
