import { Injectable, signal, WritableSignal } from '@angular/core';
import { Overlay } from '@core/models/overlay.model';
import { LayoutModel } from '@core/models/layout.model';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {
  private currentOverlaySignal = signal<Overlay | null>(null);
  private overlayLayoutsSignal: WritableSignal<LayoutModel[]> = signal<LayoutModel[]>([]);
  private currentLayoutSignal = signal<LayoutModel | null>(null);

  // Getters para acceder a los signals
  get currentOverlay() {
    return this.currentOverlaySignal;
  }

  get overlayLayouts(): WritableSignal<LayoutModel[]> {
    return this.overlayLayoutsSignal;
  }

  get currentLayout() {
    return this.currentLayoutSignal;
  }

  // Método para actualizar el overlay actual
  setCurrentOverlay(overlay: Overlay) {
    this.currentOverlaySignal.set(overlay);

    if (overlay.layouts !== 'string' && Array.isArray(overlay.layouts)) {
      this.setOverlayLayouts(overlay.layouts);
    } else {
      this.setOverlayLayouts([]);
    }
  }

  setCurrentLayout (layout: LayoutModel) {
    this.currentLayoutSignal.set(layout);
  }

  setOverlayLayouts (layouts: LayoutModel[]) {
    this.overlayLayoutsSignal.set(layouts);
  }
}
