import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlaysComponent } from './overlays.component';
import { GithubDataApiService } from '@services/github-data-api.service';
import { OverlayService } from '@services/overlay.service';
import { signal, WritableSignal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Overlay } from '@core/models/overlay.model';
import { LoadState } from '@core/enums/load-state.enum';
import { ErrorMessage } from '@core/interfaces/error-message.interface';

// Mocks para los servicios
class MockGithubDataApiService {
  overlays: WritableSignal<Overlay[]> = signal([]);
  overlaysState: WritableSignal<LoadState> = signal(LoadState.INIT);
  overlaysError: WritableSignal<ErrorMessage | null> = signal(null);
  fetchOverlays = jasmine.createSpy('fetchOverlays');
}

class MockOverlayService {
  setCurrentOverlay = jasmine.createSpy('setCurrentOverlay');
}

describe('OverlaysComponent', () => {
  let component: OverlaysComponent;
  let fixture: ComponentFixture<OverlaysComponent>;
  let mockGithubDataApi: MockGithubDataApiService;
  let mockOverlayService: MockOverlayService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverlaysComponent], // Importar el componente standalone
      providers: [
        { provide: GithubDataApiService, useClass: MockGithubDataApiService },
        { provide: OverlayService, useClass: MockOverlayService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // Para ignorar elementos desconocidos como wa-*
    }).compileComponents();

    fixture = TestBed.createComponent(OverlaysComponent);
    component = fixture.componentInstance;
    mockGithubDataApi = TestBed.inject(GithubDataApiService) as unknown as MockGithubDataApiService;
    mockOverlayService = TestBed.inject(OverlayService) as unknown as MockOverlayService;

    // Importante: llamar detectChanges inicial para que ngOnInit se ejecute
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize signals from GithubDataApiService', () => {
    expect(component.overlays).toBe(mockGithubDataApi.overlays);
    expect(component.loadState).toBe(mockGithubDataApi.overlaysState);
    expect(component.errorInfo).toBe(mockGithubDataApi.overlaysError);
  });

  it('should have LOAD_STATE available', () => {
    expect(component.LOAD_STATE).toEqual(LoadState);
  });

  describe('ngOnInit', () => {
    it('should call loadOverlays', () => {
      // ngOnInit ya se llamó en beforeEach con detectChanges
      expect(mockGithubDataApi.fetchOverlays).toHaveBeenCalledTimes(1);
    });

    it('should call overlayService.setCurrentOverlay with null', () => {
      // ngOnInit ya se llamó en beforeEach con detectChanges
      expect(mockOverlayService.setCurrentOverlay).toHaveBeenCalledWith(null);
    });
  });

  describe('loadOverlays', () => {
    it('should call githubDataApi.fetchOverlays', () => {
      // Resetear spy llamado en ngOnInit
      mockGithubDataApi.fetchOverlays.calls.reset();
      component.loadOverlays();
      expect(mockGithubDataApi.fetchOverlays).toHaveBeenCalledTimes(1);
    });
  });

  describe('retry', () => {
    it('should call loadOverlays', () => {
      // Resetear spy llamado en ngOnInit
      mockGithubDataApi.fetchOverlays.calls.reset();
      component.retry();
      expect(mockGithubDataApi.fetchOverlays).toHaveBeenCalledTimes(1);
    });
  });
}); 