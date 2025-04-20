import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingComponent } from './landing.component';
import { OverlayService } from '@services/overlay.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// Mock para OverlayService
class MockOverlayService {
  setCurrentOverlay = jasmine.createSpy('setCurrentOverlay');
}

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;
  let mockOverlayService: MockOverlayService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingComponent], // Importar componente standalone
      providers: [
        { provide: OverlayService, useClass: MockOverlayService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // Para ignorar app-projects, app-socials
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    mockOverlayService = TestBed.inject(OverlayService) as unknown as MockOverlayService;

    // Llamar detectChanges para disparar ngOnInit
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call overlayService.setCurrentOverlay with null', () => {
      // ngOnInit ya fue llamado en beforeEach con detectChanges
      expect(mockOverlayService.setCurrentOverlay).toHaveBeenCalledWith(null);
      // Verificar que se llamó solo una vez (desde el detectChanges inicial)
      expect(mockOverlayService.setCurrentOverlay).toHaveBeenCalledTimes(1);
    });
  });
}); 