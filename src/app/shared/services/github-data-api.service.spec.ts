import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GithubDataApiService } from './github-data-api.service';
import { LoadState } from '@core/enums/load-state.enum';
import { Social as ISocial } from '@core/interfaces/social.interface';
import { Social } from '@core/models/social.model';
import { HttpErrorResponse } from '@angular/common/http';

describe('GithubDataApiService', () => {
  let service: GithubDataApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GithubDataApiService]
    });
    service = TestBed.inject(GithubDataApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Asegurar que no haya peticiones pendientes después de cada prueba
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize signals correctly', () => {
    expect(service.overlays()).toEqual([]);
    expect(service.creators()).toEqual([]);
    expect(service.socials()).toEqual([]);
    expect(service.layouts()).toEqual([]);
    expect(service.technologies()).toEqual([]);

    expect(service.overlaysState()).toEqual(LoadState.INIT);
    expect(service.creatorsState()).toEqual(LoadState.INIT);
    expect(service.socialsState()).toEqual(LoadState.INIT);
    expect(service.layoutsState()).toEqual(LoadState.INIT);
    expect(service.technologiesState()).toEqual(LoadState.INIT);

    expect(service.overlaysError()).toBeNull();
    expect(service.creatorsError()).toBeNull();
    expect(service.socialsError()).toBeNull();
    expect(service.layoutsError()).toBeNull();
    expect(service.technologiesError()).toBeNull();
  });

  describe('fetchSocials', () => {
    const mockSocialsData: ISocial[] = [
      { id: 's1', page: 'Twitter', url: 'twitter.com/user' },
      { id: 's2', page: 'GitHub', url: 'github.com/user' }
    ];
    const expectedSocials: Social[] = mockSocialsData.map(s => new Social(s));

    it('should fetch socials, update signals on success (autoSubscribe=true)', () => {
      // Llamar al método (autoSubscribe es true por defecto)
      service.fetchSocials();

      // Esperar la petición HTTP
      const req = httpMock.expectOne('socials');
      expect(req.request.method).toBe('GET');

      // Responder con datos mock
      req.flush(mockSocialsData);

      // Verificar las signals
      expect(service.socials()).toEqual(expectedSocials);
      expect(service.socialsState()).toEqual(LoadState.LOADED);
      expect(service.socialsError()).toBeNull();
    });

    it('should return observable that fetches socials (autoSubscribe=false)', (done) => {
      // Llamar al método
      service.fetchSocials(undefined, false).subscribe(socials => {
        expect(socials).toEqual(expectedSocials);
        // Verificar las signals también se actualizan
        expect(service.socials()).toEqual(expectedSocials);
        expect(service.socialsState()).toEqual(LoadState.LOADED);
        expect(service.socialsError()).toBeNull();
        done();
      });

      // Esperar la petición HTTP y responder
      const req = httpMock.expectOne('socials');
      expect(req.request.method).toBe('GET');
      req.flush(mockSocialsData);
    });

    it('should update error and state signals on HTTP error', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'test 404 error',
        status: 404, statusText: 'Not Found'
      });

      // Llamar al método
      service.fetchSocials();

      // Esperar la petición y responder con error
      const req = httpMock.expectOne('socials');
      req.flush('Error', errorResponse);

      // Verificar las signals
      expect(service.socials()).toEqual([]); // Debería mantener el valor inicial o el fallback
      expect(service.socialsState()).toEqual(LoadState.ERROR);
      expect(service.socialsError()).toEqual({
        message: '404: Not Found',
        status: 404,
        timestamp: jasmine.any(Date) // Usar jasmine.any para el timestamp
      });
    });

    it('should set state to LOADING immediately', () => {
      // Estado inicial
      expect(service.socialsState()).toEqual(LoadState.INIT);
      // Llamar al método pero no responder aún
      service.fetchSocials();
      // Verificar que el estado cambió a LOADING
      expect(service.socialsState()).toEqual(LoadState.LOADING);
      // Limpiar la petición pendiente
      httpMock.expectOne('socials').flush([]);
    });
  });

  // --- Pruebas para otros métodos (fetchCreators, fetchLayouts, etc.) --- //
  // Se necesitarían mocks más complejos para simular las dependencias y respuestas HTTP
  // Ejemplo básico para fetchTechnologies:
  describe('fetchTechnologies', () => {
     it('should call http.get for technologies', () => {
        service.fetchTechnologies();
        const req = httpMock.expectOne('tecnologies'); // Ojo con la URL
        expect(req.request.method).toBe('GET');
        req.flush([]); // Responder vacío para completar
        expect(service.technologiesState()).toBe(LoadState.LOADED);
     });
  });

}); 