import { TestBed } from '@angular/core/testing';
import { OverlayService } from './overlay.service';
import { Overlay } from '@core/models/overlay.model';
import { LayoutModel } from '@core/models/layout.model';
import { signal, Signal } from '@angular/core';
import { OverlayStatus } from '@core/enums/overlays.enum';
import { LayoutStatus } from '@core/enums/layout.enum';

// Datos de prueba mock
const mockLayout1: LayoutModel = new LayoutModel({ id: 'layout1', name: 'Layout 1', overlays: 'ov1', status: LayoutStatus.ACTIVO, preview: '', source: '/layout1' });
const mockLayout2: LayoutModel = new LayoutModel({ id: 'layout2', name: 'Layout 2', overlays: 'ov1', status: LayoutStatus.ACTIVO, preview: '', source: '/layout2' });
const mockOverlayWithLayouts: Overlay = new Overlay({ id: 'ov1', name: 'Overlay 1', status: OverlayStatus.ACTIVO, preview: '', owner: '', creator: '', technologies: '', layouts: [mockLayout1, mockLayout2] });
const mockOverlayWithoutLayouts: Overlay = new Overlay({ id: 'ov2', name: 'Overlay 2', status: OverlayStatus.ACTIVO, preview: '', owner: '', creator: '', technologies: '', layouts: [] });
const mockOverlayWithStringLayouts: Overlay = new Overlay({ id: 'ov3', name: 'Overlay 3', status: OverlayStatus.ACTIVO, preview: '', owner: '', creator: '', technologies: '', layouts: 'some_string' }); // Caso donde layouts es string

describe('OverlayService', () => {
  let service: OverlayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OverlayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize signals with null/empty values', () => {
    expect(service.currentOverlay()).toBeNull();
    expect(service.overlayLayouts()).toEqual([]);
    expect(service.currentLayout()).toBeNull();
  });

  describe('setCurrentOverlay', () => {
    it('should update currentOverlaySignal', () => {
      service.setCurrentOverlay(mockOverlayWithLayouts);
      expect(service.currentOverlay()).toEqual(mockOverlayWithLayouts);
      service.setCurrentOverlay(null);
      expect(service.currentOverlay()).toBeNull();
    });

    it('should update overlayLayoutsSignal if overlay has valid layouts array', () => {
      service.setCurrentOverlay(mockOverlayWithLayouts);
      expect(service.overlayLayouts()).toEqual([mockLayout1, mockLayout2]);
    });

    it('should set overlayLayoutsSignal to empty array if overlay is null', () => {
      // Set some layouts first
      service.setOverlayLayouts([mockLayout1]);
      expect(service.overlayLayouts()).toEqual([mockLayout1]);
      // Set overlay to null
      service.setCurrentOverlay(null);
      expect(service.overlayLayouts()).toEqual([]);
    });

    it('should set overlayLayoutsSignal to empty array if overlay has empty layouts array', () => {
      service.setCurrentOverlay(mockOverlayWithoutLayouts);
      expect(service.overlayLayouts()).toEqual([]);
    });

    it('should set overlayLayoutsSignal to empty array if overlay.layouts is not an array', () => {
       service.setCurrentOverlay(mockOverlayWithStringLayouts);
       expect(service.overlayLayouts()).toEqual([]);
    });
  });

  describe('setCurrentLayout', () => {
    it('should update currentLayoutSignal', () => {
      service.setCurrentLayout(mockLayout1);
      expect(service.currentLayout()).toEqual(mockLayout1);
      service.setCurrentLayout(null);
      expect(service.currentLayout()).toBeNull();
    });
  });

  describe('setOverlayLayouts', () => {
    it('should update overlayLayoutsSignal directly', () => {
      const layouts = [mockLayout1, mockLayout2];
      service.setOverlayLayouts(layouts);
      expect(service.overlayLayouts()).toEqual(layouts);
      service.setOverlayLayouts([]);
      expect(service.overlayLayouts()).toEqual([]);
    });
  });

  // Test exposed signals are readonly (compilation check)
  it('should expose signals as readonly', () => {
      const overlaySignal: Signal<Overlay | null> = service.currentOverlay;
      const layoutsSignal: Signal<LayoutModel[]> = service.overlayLayouts;
      const layoutSignal: Signal<LayoutModel | null> = service.currentLayout;

      // Check if they are indeed signals
      expect(typeof overlaySignal).toBe('function');
      expect(typeof layoutsSignal).toBe('function');
      expect(typeof layoutSignal).toBe('function');
  });
}); 