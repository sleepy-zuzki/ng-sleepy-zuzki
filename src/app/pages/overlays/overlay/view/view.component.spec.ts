import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ViewComponent } from './view.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { GithubDataApiService } from '@services/github-data-api.service';
import { OverlayService } from '@services/overlay.service';
import { signal, WritableSignal, CUSTOM_ELEMENTS_SCHEMA, Signal } from '@angular/core';
import { Overlay } from '@core/models/overlay.model';
import { LayoutModel } from '@core/models/layout.model';
import { BehaviorSubject, of } from 'rxjs';
import { OverlayStatus } from '@core/enums/overlays.enum';
import { LayoutStatus } from '@core/enums/layout.enum';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

// Mocks
const mockLayout1: LayoutModel = new LayoutModel({ id: 'layout1', name: 'L1', overlays: 'ov1', status: LayoutStatus.ACTIVO, preview: '', source: '/layout1.html' });
const mockLayout2: LayoutModel = new LayoutModel({ id: 'layout2', name: 'L2', overlays: 'ov1', status: LayoutStatus.ACTIVO, preview: '', source: '/layout2.html' });
const mockOverlay1: Overlay = new Overlay({ id: 'ov1', name: 'Overlay 1', status: OverlayStatus.ACTIVO, preview: '', owner: '', creator: '', technologies: '', layouts: [mockLayout1, mockLayout2] });
const mockOverlay2: Overlay = new Overlay({ id: 'ov2', name: 'Overlay 2', status: OverlayStatus.ACTIVO, preview: '', owner: '', creator: '', technologies: '', layouts: [] });

class MockGithubDataApiService {
  overlays: WritableSignal<Overlay[]> = signal<Overlay[]>([mockOverlay1, mockOverlay2]);
  fetchOverlays = jasmine.createSpy('fetchOverlays');
  
  // Corregimos el mock para que no genere error 404
  getSocials = jasmine.createSpy('getSocials').and.returnValue(of([]));
  
  // Añadimos un manejador de errores para evitar logs de error en las pruebas
  handleError(error: any): void {
    // No hacemos nada en las pruebas para evitar logs de error
    console.log('Error interceptado en pruebas:', error);
  }
}

class MockOverlayService {
  currentLayoutSignal: WritableSignal<LayoutModel | null> = signal<LayoutModel | null>(null);
  setCurrentOverlay = jasmine.createSpy('setCurrentOverlay');
  setCurrentLayout = jasmine.createSpy('setCurrentLayout').and.callFake(
      (layout: LayoutModel | null) => this.currentLayoutSignal.set(layout)
  );
  overlayLayoutsSignal: WritableSignal<LayoutModel[]> = signal<LayoutModel[]>([]);

  get currentLayout(): Signal<LayoutModel | null> {
    return this.currentLayoutSignal;
  }

  get overlayLayouts(): Signal<LayoutModel[]> {
      return this.overlayLayoutsSignal;
  }
}

// Mock ActivatedRoute
const mockParamMap = new BehaviorSubject(convertToParamMap({}));
const mockActivatedRoute = {
  paramMap: mockParamMap.asObservable()
};

describe('ViewComponent', () => {
  let component: ViewComponent;
  let fixture: ComponentFixture<ViewComponent>;
  let mockApiService: MockGithubDataApiService;
  let mockOverlayService: MockOverlayService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ViewComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: GithubDataApiService, useClass: MockGithubDataApiService },
        { provide: OverlayService, useClass: MockOverlayService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewComponent);
    component = fixture.componentInstance;
    mockApiService = TestBed.inject(GithubDataApiService) as unknown as MockGithubDataApiService;
    mockOverlayService = TestBed.inject(OverlayService) as unknown as MockOverlayService;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verificar que no haya solicitudes pendientes
    httpMock.verify();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  // Prueba 1: Verificar que se obtenga el ID del overlay de los parámetros de ruta
  it('should get overlayId from route params', fakeAsync(() => {
    // Establecer el ID en la ruta
    mockParamMap.next(convertToParamMap({ overlay_id: 'test_id' }));
    
    // Detectar cambios para que se actualice el componente
    fixture.detectChanges();
    tick();
    
    // Verificar que el overlayId en el componente sea el correcto
    expect(component.overlayId()).toBe('test_id');
    
    // Cambiar el ID a null y verificar que se actualice
    mockParamMap.next(convertToParamMap({}));
    tick();
    expect(component.overlayId()).toBeNull();
  }));

  // Prueba 2: Efecto de selección de overlay y layout
  describe('Overlay Selection Effect', () => {
    beforeEach(() => {
      // Reset de los spies antes de cada prueba
      mockApiService.fetchOverlays.calls.reset();
      mockOverlayService.setCurrentOverlay.calls.reset();
      mockOverlayService.setCurrentLayout.calls.reset();
    });

    it('should select overlay and first layout when ID exists and overlays are available', fakeAsync(() => {
      // Establecer ID y overlays
      mockParamMap.next(convertToParamMap({ overlay_id: 'ov1' }));
      mockApiService.overlays.set([mockOverlay1, mockOverlay2]);
      
      // Activar el efecto
      fixture.detectChanges();
      tick();
      
      // Verificaciones
      expect(component.currentOverlay).toEqual(mockOverlay1);
      expect(mockOverlayService.setCurrentOverlay).toHaveBeenCalledWith(mockOverlay1);
      expect(mockOverlayService.setCurrentLayout).toHaveBeenCalledWith(mockLayout1);
      expect(mockApiService.fetchOverlays).not.toHaveBeenCalled();
    }));

    it('should reset services when no overlay ID is provided', fakeAsync(() => {
      // Sin ID pero con overlays disponibles
      mockParamMap.next(convertToParamMap({}));
      mockApiService.overlays.set([mockOverlay1]);
      
      fixture.detectChanges();
      tick();
      
      // Verificar reseteo
      expect(component.currentOverlay).toBeNull();
      expect(mockOverlayService.setCurrentOverlay).toHaveBeenCalledWith(null);
      expect(mockOverlayService.setCurrentLayout).toHaveBeenCalledWith(null);
      expect(mockApiService.fetchOverlays).not.toHaveBeenCalled();
    }));

    it('should fetch overlays when ID exists but overlays array is empty', fakeAsync(() => {
      mockParamMap.next(convertToParamMap({ overlay_id: 'ov1' }));
      mockApiService.overlays.set([]);
      
      fixture.detectChanges();
      tick();
      
      // Verificar que se llame a fetchOverlays
      expect(component.currentOverlay).toBeNull();
      expect(mockOverlayService.setCurrentOverlay).toHaveBeenCalledWith(null);
      expect(mockOverlayService.setCurrentLayout).toHaveBeenCalledWith(null);
      expect(mockApiService.fetchOverlays).toHaveBeenCalledTimes(1);
    }));

    it('should set layout to null when overlay has no layouts', fakeAsync(() => {
      mockParamMap.next(convertToParamMap({ overlay_id: 'ov2' }));
      mockApiService.overlays.set([mockOverlay1, mockOverlay2]);
      
      fixture.detectChanges();
      tick();
      
      expect(component.currentOverlay).toEqual(mockOverlay2);
      expect(mockOverlayService.setCurrentOverlay).toHaveBeenCalledWith(mockOverlay2);
      expect(mockOverlayService.setCurrentLayout).toHaveBeenCalledWith(null);
    }));
  });

  // Prueba 3: Efecto de actualización de iframe
  xdescribe('Iframe Update Effect', () => {
    // En vez de crear manualmente un iframe, manipularemos el DOM como lo haría Angular
    // y emularemos el ViewChild en cada prueba según sea necesario
    
    it('should update iframe src when layout changes', fakeAsync(() => {
      // 1. Creamos un iframe y lo añadimos al componente como ViewChild
      const iframe = document.createElement('iframe');
      
      // Añadimos un spy para monitorear los cambios en la propiedad src
      Object.defineProperty(iframe, 'src', {
        writable: true,
        value: 'about:blank'
      });
      
      spyOnProperty(iframe, 'src', 'set').and.callThrough();
      
      component.viewElement = { nativeElement: iframe } as any;
      
      // 2. Inicializar el componente
      fixture.detectChanges();
      tick();
      
      // 3. Cambiar el layout manualmente y forzar la actualización
      mockOverlayService.setCurrentLayout(mockLayout1);
      component.ngAfterViewInit();
      fixture.detectChanges();
      tick();
      
      // 4. Verificar que se llamó a establecer el src con el valor correcto
      expect(iframe.src).toBeDefined();
      expect(iframe.src.includes(mockLayout1.source.replace(/^\//, '')) || 
             iframe.src.includes('http://localhost:9876' + mockLayout1.source)).toBeTrue();
      
      // 5. Cambiar a otro layout y verificar nueva actualización
      mockOverlayService.setCurrentLayout(mockLayout2);
      component.ngAfterViewInit();
      fixture.detectChanges();
      tick();
      
      expect(iframe.src).toBeDefined();
      expect(iframe.src.includes(mockLayout2.source.replace(/^\//, '')) || 
             iframe.src.includes('http://localhost:9876' + mockLayout2.source)).toBeTrue();
    }));
    
    it('should set iframe src to about:blank when layout is null', fakeAsync(() => {
      const iframe = document.createElement('iframe');
      
      // Configurar spy similar al otro test
      Object.defineProperty(iframe, 'src', {
        writable: true,
        value: 'http://example.com'
      });
      
      spyOnProperty(iframe, 'src', 'set').and.callThrough();
      
      component.viewElement = { nativeElement: iframe } as any;
      
      fixture.detectChanges();
      tick();
      
      // Establecer el layout a null
      mockOverlayService.setCurrentLayout(null);
      component.ngAfterViewInit();
      fixture.detectChanges();
      tick();
      
      // Verificar que se actualizó a about:blank
      expect(iframe.src).toBe('about:blank');
    }));
    
    it('should not update iframe if viewElement is undefined', fakeAsync(() => {
      // No establecemos un viewElement, simulando que aún no está disponible
      component.viewElement = undefined;
      
      fixture.detectChanges();
      tick();
      
      // Intentar actualizar el layout
      mockOverlayService.setCurrentLayout(mockLayout1);
      
      // Forzar la actualización manualmente - no debería causar error
      component['ngAfterViewInit']();
      fixture.detectChanges();
      tick();
      
      // No debería fallar la prueba
      expect(true).toBeTruthy(); // Si llegamos aquí, la prueba pasa
    }));
  });
  
  // Prueba 4: ngAfterViewInit
  describe('ngAfterViewInit', () => {
    it('should set initial iframe src based on current layout', () => {
      // Configurar el layout y el elemento iframe
      const iframe = document.createElement('iframe');
      component.viewElement = { nativeElement: iframe } as any;
      mockOverlayService.currentLayoutSignal.set(mockLayout1);
      
      // Llamar a ngAfterViewInit directamente
      component.ngAfterViewInit();
      
      // Verificar que el src se estableció correctamente
      expect(iframe.src).toContain(mockLayout1.source);
    });
    
    it('should set iframe src to about:blank when no layout exists', () => {
      const iframe = document.createElement('iframe');
      component.viewElement = { nativeElement: iframe } as any;
      mockOverlayService.currentLayoutSignal.set(null);
      
      component.ngAfterViewInit();
      
      expect(iframe.src).toBe('about:blank');
    });
    
    it('should not throw error when viewElement is undefined', () => {
      component.viewElement = undefined;
      mockOverlayService.currentLayoutSignal.set(mockLayout1);
      
      // Esto no debería lanzar error
      expect(() => component.ngAfterViewInit()).not.toThrow();
    });
  });
});

