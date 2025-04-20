import { ComponentFixture, TestBed, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { OverlayComponent } from './overlay.component';
import { OverlayService } from '@services/overlay.service';
import { Overlay } from '@core/models/overlay.model';
import { Creator } from '@core/models/creator.model';
import { LayoutModel } from '@core/models/layout.model';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, signal } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { OverlayStatus } from '@core/enums/overlays.enum';
import { LayoutStatus } from '@core/enums/layout.enum';

// Mock para OverlayService
class MockOverlayService {
  setCurrentOverlay = jasmine.createSpy('setCurrentOverlay');
  setCurrentLayout = jasmine.createSpy('setCurrentLayout');
}

// Mock data
const mockLayout1: LayoutModel = new LayoutModel({ id: 'l1', name:'L1', overlays: 'ov1', status: LayoutStatus.ACTIVO, preview: '', source: '' });
const mockCreator: Creator = new Creator({ id: 'c1', name: 'Test Creator', email: '', socials: [] });
const mockOverlayWithObjectCreator: Overlay = new Overlay({
    id: 'ov1',
    name: 'Overlay 1',
    status: OverlayStatus.ACTIVO,
    preview: '',
    owner: '',
    creator: mockCreator, // Objeto Creator
    technologies: '',
    layouts: [mockLayout1]
});
const mockOverlayWithStringCreator: Overlay = new Overlay({
    id: 'ov2',
    name: 'Overlay 2',
    status: OverlayStatus.ACTIVO,
    preview: '',
    owner: '',
    creator: 'creator_id_string', // String como creator
    technologies: '',
    layouts: []
});
const mockOverlayNoCreator: Overlay = new Overlay({
    id: 'ov3',
    name: 'Overlay 3',
    status: OverlayStatus.ACTIVO,
    preview: '',
    owner: '',
    creator: undefined, // Sin creator
    technologies: '',
    layouts: [mockLayout1]
});

// Componente Host para probar InputSignal
@Component({
  standalone: true,
  imports: [OverlayComponent, RouterTestingModule], // Importar OverlayComponent aquí
  template: `<app-overlay [overlay]="overlaySignal()" />`,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
class TestHostComponent {
  overlaySignal = signal<Overlay | undefined>(undefined);
}

describe('OverlayComponent', () => {
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;
  let overlayComponent: OverlayComponent;
  let mockOverlayService: MockOverlayService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent], // Importar el Host
      providers: [
        { provide: OverlayService, useClass: MockOverlayService },
        // { provide: ComponentFixtureAutoDetect, useValue: true } // Opcional para detectar cambios automáticamente
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // Necesario si TestHostComponent usa schemas
    })
    .compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    mockOverlayService = TestBed.inject(OverlayService) as unknown as MockOverlayService;

    // Obtener la instancia del componente OverlayComponent anidado
    // Se puede hacer buscando en el debugElement o esperando a detectChanges
    // hostFixture.detectChanges(); // Llamar aquí si no usamos AutoDetect
    overlayComponent = hostFixture.debugElement.children[0].componentInstance;
  });

  it('should create', () => {
    hostFixture.detectChanges(); // Necesario para renderizar el componente hijo
    expect(overlayComponent).toBeTruthy();
  });

  it('should receive overlay input signal', () => {
    hostComponent.overlaySignal.set(mockOverlayWithObjectCreator);
    hostFixture.detectChanges();
    expect(overlayComponent.overlay()).toEqual(mockOverlayWithObjectCreator);
  });

  describe('getOverlayCreator', () => {
    it('should return creator name if creator is an object', () => {
      hostComponent.overlaySignal.set(mockOverlayWithObjectCreator);
      hostFixture.detectChanges();
      expect(overlayComponent.getOverlayCreator()).toBe(mockCreator.name);
    });

    it('should return creator string if creator is a string', () => {
      hostComponent.overlaySignal.set(mockOverlayWithStringCreator);
      hostFixture.detectChanges();
      expect(overlayComponent.getOverlayCreator()).toBe('creator_id_string');
    });

    it('should return empty string if overlay is undefined', () => {
      hostComponent.overlaySignal.set(undefined);
      hostFixture.detectChanges();
      expect(overlayComponent.getOverlayCreator()).toBe('');
    });

    it('should return empty string if creator is undefined', () => {
      hostComponent.overlaySignal.set(mockOverlayNoCreator);
      hostFixture.detectChanges();
      expect(overlayComponent.getOverlayCreator()).toBe('');
    });
  });

  describe('changeLayout', () => {
    beforeEach(() => {
        mockOverlayService.setCurrentOverlay.calls.reset();
        mockOverlayService.setCurrentLayout.calls.reset();
    });

    it('should call setCurrentOverlay with the current overlay', () => {
      hostComponent.overlaySignal.set(mockOverlayWithObjectCreator);
      hostFixture.detectChanges();
      overlayComponent.changeLayout();
      expect(mockOverlayService.setCurrentOverlay).toHaveBeenCalledWith(mockOverlayWithObjectCreator);
    });

    it('should call setCurrentLayout with the first layout if layouts exist', () => {
      hostComponent.overlaySignal.set(mockOverlayWithObjectCreator);
      hostFixture.detectChanges();
      overlayComponent.changeLayout();
      expect(mockOverlayService.setCurrentLayout).toHaveBeenCalledWith(mockLayout1);
    });

    it('should not call setCurrentLayout if overlay has no layouts', () => {
      hostComponent.overlaySignal.set(mockOverlayWithStringCreator); // Este no tiene layouts
      hostFixture.detectChanges();
      overlayComponent.changeLayout();
      expect(mockOverlayService.setCurrentLayout).not.toHaveBeenCalled();
    });

    it('should not call services if overlay is undefined', () => {
      hostComponent.overlaySignal.set(undefined);
      hostFixture.detectChanges();
      overlayComponent.changeLayout();
      expect(mockOverlayService.setCurrentOverlay).not.toHaveBeenCalled();
      expect(mockOverlayService.setCurrentLayout).not.toHaveBeenCalled();
    });
  });
}); 