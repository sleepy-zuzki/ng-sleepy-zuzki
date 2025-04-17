import { Injectable, signal } from '@angular/core';
import { Overlay } from '@core/models/overlay.model';
import { LayoutModel } from '@core/models/layout.model';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {
  private currentOverlaySignal = signal<Overlay | null>(null);
  private overlayLayoutsSignal = signal<LayoutModel[]>([]);

  // Getters para acceder a los signals
  get currentOverlay() {
    return this.currentOverlaySignal;
  }

  get overlayLayouts() {
    return this.overlayLayoutsSignal;
  }

  // Método para actualizar el overlay actual
  setCurrentOverlay(overlay: Overlay) {
    this.currentOverlaySignal.set(overlay);
    
    if (overlay.layouts !== 'string' && Array.isArray(overlay.layouts)) {
      this.overlayLayoutsSignal.set(overlay.layouts);
    } else {
      this.overlayLayoutsSignal.set([]);
    }
  }
} 