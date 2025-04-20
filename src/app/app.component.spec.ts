import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { GithubDataApiService } from '@services/github-data-api.service';
import { OverlayService } from '@services/overlay.service';
import { signal, WritableSignal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Overlay } from '@core/models/overlay.model';
import { LayoutModel } from '@core/models/layout.model';
import { RouterTestingModule } from '@angular/router/testing';

class MockGithubDataApiService {
  overlays: WritableSignal<Overlay[]> = signal([]);
}

class MockOverlayService {
  overlayLayouts: WritableSignal<LayoutModel[]> = signal([]);
  currentLayout: WritableSignal<LayoutModel | null> = signal(null);
  setCurrentLayout = jasmine.createSpy('setCurrentLayout');
}

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let mockOverlayService: MockOverlayService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterTestingModule
      ],
      providers: [
        { provide: GithubDataApiService, useClass: MockGithubDataApiService },
        { provide: OverlayService, useClass: MockOverlayService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    mockOverlayService = TestBed.inject(OverlayService) as unknown as MockOverlayService;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have the 'Sleepy Zuzki' title`, () => {
    expect(app.title).toEqual('Sleepy Zuzki');
  });

  it('should have overlays signal initialized', () => {
    expect(app.overlays).toBeDefined();
    expect(typeof app.overlays).toBe('function');
  });

  describe('changeLayout', () => {
    const mockLayout = new LayoutModel({id: 'l1', name: 'Layout 1'} as any);

    beforeEach(() => {
        mockOverlayService.overlayLayouts.set([mockLayout]);
        mockOverlayService.setCurrentLayout.calls.reset();
        app.drawer = { nativeElement: { open: true } } as any;
    });

    it('should call overlayService.setCurrentLayout with the found layout', () => {
        app.changeLayout('l1');
        expect(mockOverlayService.setCurrentLayout).toHaveBeenCalledWith(mockLayout);
    });

    it('should call closeDrawer if layout is found', () => {
        spyOn(app, 'closeDrawer');
        app.changeLayout('l1');
        expect(app.closeDrawer).toHaveBeenCalled();
    });

    it('should not call overlayService.setCurrentLayout if layout is not found', () => {
        app.changeLayout('non_existent_id');
        expect(mockOverlayService.setCurrentLayout).not.toHaveBeenCalled();
    });

    it('should not call closeDrawer if layout is not found', () => {
        spyOn(app, 'closeDrawer');
        app.changeLayout('non_existent_id');
        expect(app.closeDrawer).not.toHaveBeenCalled();
    });
  });

  // Las pruebas para openDrawer y closeDrawer necesitarían simular el ViewChild 'drawer'
  // Se pueden añadir si se considera necesario probar esa interacción específica con el DOM.

});
