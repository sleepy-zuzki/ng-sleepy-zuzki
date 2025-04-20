import { Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Overlay } from '@core/models/overlay.model';
import { Overlay as IOverlay } from '@core/interfaces/overlay.interface';
import { Creator } from '@core/models/creator.model';
import { Creator as ICreator } from '@core/interfaces/creator.interface';
import { Social } from '@core/models/social.model';
import { Social as ISocial } from '@core/interfaces/social.interface';
import { LayoutModel } from '@core/models/layout.model';
import { Layout } from '@core/interfaces/layout.interface';
import { TechnologyModel } from '@core/models/technology.model';
import { Technology } from '@core/interfaces/technology.interface';
import { OverlayStatus } from '@core/enums/overlays.enum';
import { LayoutStatus } from '@core/enums/layout.enum';
import { LoadState } from '@core/enums/load-state.enum';
import { ErrorMessage } from '@core/interfaces/error-message.interface';
import { BehaviorSubject, Observable, catchError, finalize, map, of, switchMap, tap } from 'rxjs';


/**
 * Servicio para obtener datos desde la API de GitHub
 * Implementa un patrón de manejo de estado basado en Signals y RxJS
 */
@Injectable({
  providedIn: 'root'
})
export class GithubDataApiService {
  // Signals públicas para datos
  overlays: Signal<Overlay[]>;
  creators: Signal<Creator[]>;
  socials: Signal<Social[]>;
  layouts: Signal<LayoutModel[]>;
  technologies: Signal<TechnologyModel[]>;
  // Signals públicas para estados de carga
  overlaysState: Signal<LoadState>;
  creatorsState: Signal<LoadState>;
  socialsState: Signal<LoadState>;
  layoutsState: Signal<LoadState>;
  technologiesState: Signal<LoadState>;
  // Signals públicas para errores
  overlaysError: Signal<ErrorMessage | null>;
  creatorsError: Signal<ErrorMessage | null>;
  socialsError: Signal<ErrorMessage | null>;
  layoutsError: Signal<ErrorMessage | null>;
  technologiesError: Signal<ErrorMessage | null>;

  /** BehaviorSubjects para datos - estado interno mutable */
  #overlaysSubject: BehaviorSubject<Overlay[]> = new BehaviorSubject<Overlay[]>([]);
  #creatorsSubject: BehaviorSubject<Creator[]> = new BehaviorSubject<Creator[]>([]);
  #socialsSubject: BehaviorSubject<Social[]> = new BehaviorSubject<Social[]>([]);
  #layoutsSubject: BehaviorSubject<LayoutModel[]> = new BehaviorSubject<LayoutModel[]>([]);
  #technologiesSubject: BehaviorSubject<TechnologyModel[]> = new BehaviorSubject<TechnologyModel[]>([]);

  /** BehaviorSubjects para estados de carga - estado interno mutable */
  #overlaysStateSubject: BehaviorSubject<LoadState> = new BehaviorSubject<LoadState>(LoadState.INIT);
  #creatorsStateSubject: BehaviorSubject<LoadState> = new BehaviorSubject<LoadState>(LoadState.INIT);
  #socialsStateSubject: BehaviorSubject<LoadState> = new BehaviorSubject<LoadState>(LoadState.INIT);
  #layoutsStateSubject: BehaviorSubject<LoadState> = new BehaviorSubject<LoadState>(LoadState.INIT);
  #technologiesStateSubject: BehaviorSubject<LoadState> = new BehaviorSubject<LoadState>(LoadState.INIT);

  /** BehaviorSubjects para errores - estado interno mutable */
  #overlaysErrorSubject: BehaviorSubject<ErrorMessage | null> = new BehaviorSubject<ErrorMessage | null>(null);
  #creatorsErrorSubject: BehaviorSubject<ErrorMessage | null> = new BehaviorSubject<ErrorMessage | null>(null);
  #socialsErrorSubject: BehaviorSubject<ErrorMessage | null> = new BehaviorSubject<ErrorMessage | null>(null);
  #layoutsErrorSubject: BehaviorSubject<ErrorMessage | null> = new BehaviorSubject<ErrorMessage | null>(null);
  #technologiesErrorSubject: BehaviorSubject<ErrorMessage | null> = new BehaviorSubject<ErrorMessage | null>(null);

  /**
   * Constructor del servicio
   * Inicializa todas las signals a partir de los BehaviorSubjects
   * @param http Cliente HTTP para realizar peticiones a la API
   */
  constructor(private http: HttpClient) {
    // Inicializar signals para datos usando toSignal
    this.overlays = toSignal(this.#overlaysSubject.asObservable(), { initialValue: [] });
    this.creators = toSignal(this.#creatorsSubject.asObservable(), { initialValue: [] });
    this.socials = toSignal(this.#socialsSubject.asObservable(), { initialValue: [] });
    this.layouts = toSignal(this.#layoutsSubject.asObservable(), { initialValue: [] });
    this.technologies = toSignal(this.#technologiesSubject.asObservable(), { initialValue: [] });

    // Inicializar signals para estados de carga
    this.overlaysState = toSignal(this.#overlaysStateSubject.asObservable(), { initialValue: LoadState.INIT });
    this.creatorsState = toSignal(this.#creatorsStateSubject.asObservable(), { initialValue: LoadState.INIT });
    this.socialsState = toSignal(this.#socialsStateSubject.asObservable(), { initialValue: LoadState.INIT });
    this.layoutsState = toSignal(this.#layoutsStateSubject.asObservable(), { initialValue: LoadState.INIT });
    this.technologiesState = toSignal(this.#technologiesStateSubject.asObservable(), { initialValue: LoadState.INIT });

    // Inicializar signals para errores
    this.overlaysError = toSignal(this.#overlaysErrorSubject.asObservable(), { initialValue: null });
    this.creatorsError = toSignal(this.#creatorsErrorSubject.asObservable(), { initialValue: null });
    this.socialsError = toSignal(this.#socialsErrorSubject.asObservable(), { initialValue: null });
    this.layoutsError = toSignal(this.#layoutsErrorSubject.asObservable(), { initialValue: null });
    this.technologiesError = toSignal(this.#technologiesErrorSubject.asObservable(), { initialValue: null });
  }

  /**
   * Obtiene los overlays con toda su información relacionada
   * Realiza una carga en cascada si es necesario (primero creadores, luego layouts)
   * @param params Parámetros HTTP opcionales
   */
  fetchOverlays(params?: HttpParams): void {
    this.#overlaysStateSubject.next(LoadState.LOADING);
    this.#overlaysErrorSubject.next(null);

    const availableCreators: Creator[] = this.#creatorsSubject.getValue();

    if (availableCreators.length === 0) {
      // Si no hay creadores, cargarlos primero
      this.fetchCreators(params, true)
        .pipe(
          switchMap(() => this.fetchOverlaysWithLayouts(params, true)),
          finalize(() => {
            if (this.#overlaysStateSubject.getValue() === LoadState.LOADING) {
              this.#overlaysStateSubject.next(LoadState.LOADED);
            }
          })
        )
        .subscribe();
    } else {
      // Si ya hay creadores, cargar overlays con layouts
      this.fetchOverlaysWithLayouts(params, true)
        .pipe(
          finalize(() => {
            if (this.#overlaysStateSubject.getValue() === LoadState.LOADING) {
              this.#overlaysStateSubject.next(LoadState.LOADED);
            }
          })
        )
        .subscribe();
    }
  }

  /**
   * Obtiene todos los overlays con sus layouts
   * Realiza una carga en cascada si es necesario
   * @param params Parámetros HTTP opcionales
   * @param autoSubscribe Si es true, autogestiona la suscripción
   * @returns Observable con los overlays obtenidos
   */
  fetchOverlaysWithLayouts(
    params?: HttpParams,
    autoSubscribe: boolean = false
  ): Observable<Overlay[]> {
    this.#overlaysStateSubject.next(LoadState.LOADING);
    this.#overlaysErrorSubject.next(null);

    const availableLayouts: LayoutModel[] = this.#layoutsSubject.getValue();

    const observable: Observable<Overlay[]> = availableLayouts.length === 0
      ? this.fetchRawOverlays(params).pipe(
          switchMap(() => this.fetchLayouts(params, false)),
          switchMap(() => this.loadOverlaysWithFullData(params))
        )
      : this.loadOverlaysWithFullData(params);

    return autoSubscribe ? observable : observable;
  }

  /**
   * Obtiene las redes sociales
   * @param params Parámetros HTTP opcionales
   * @param autoSubscribe Si es true, autogestiona la suscripción
   * @returns Observable con las redes sociales obtenidas
   */
  fetchSocials(
    params?: HttpParams,
    autoSubscribe: boolean = true
  ): Observable<Social[]> {
    this.#socialsStateSubject.next(LoadState.LOADING);
    this.#socialsErrorSubject.next(null);

    const observable: Observable<Social[]> = this.http.get<ISocial[]>('socials', { params }).pipe(
      map((response: ISocial[]): Social[] =>
        response.map((data: ISocial) => new Social(data))
      ),
      tap((socials: Social[]) => {
        this.#socialsSubject.next(socials);
        this.#socialsStateSubject.next(LoadState.LOADED);
      }),
      catchError((error: any) => this.handleError<Social[]>(
        error,
        this.#socialsErrorSubject,
        this.#socialsStateSubject,
        'Error fetching socials',
        []
      )),
      finalize(() => {
        if (this.#socialsStateSubject.getValue() === LoadState.LOADING) {
          this.#socialsStateSubject.next(LoadState.LOADED);
        }
      })
    );

    if (autoSubscribe) {
      observable.subscribe();
      return of(this.#socialsSubject.getValue());
    }

    return observable;
  }

  /**
   * Obtiene los creadores con sus redes sociales
   * Realiza una carga en cascada si es necesario
   * @param params Parámetros HTTP opcionales
   * @param autoSubscribe Si es true, autogestiona la suscripción
   * @returns Observable con los creadores obtenidos
   */
  fetchCreators(
    params?: HttpParams,
    autoSubscribe: boolean = true
  ): Observable<Creator[]> {
    this.#creatorsStateSubject.next(LoadState.LOADING);
    this.#creatorsErrorSubject.next(null);

    const availableSocials: Social[] = this.#socialsSubject.getValue();

    const observable: Observable<Creator[]> = availableSocials.length === 0
      ? this.fetchSocials(params, false).pipe(
          switchMap(() => this.loadCreators(params))
        )
      : this.loadCreators(params);

    const finalObservable: Observable<Creator[]> = observable.pipe(
      finalize(() => {
        if (this.#creatorsStateSubject.getValue() === LoadState.LOADING) {
          this.#creatorsStateSubject.next(LoadState.LOADED);
        }
      })
    );

    if (autoSubscribe) {
      finalObservable.subscribe();
      return of(this.#creatorsSubject.getValue());
    }

    return finalObservable;
  }

  /**
   * Obtiene los layouts
   * @param params Parámetros HTTP opcionales
   * @param autoSubscribe Si es true, autogestiona la suscripción
   * @returns Observable con los layouts obtenidos
   */
  fetchLayouts(
    params?: HttpParams,
    autoSubscribe: boolean = true
  ): Observable<LayoutModel[]> {
    this.#layoutsStateSubject.next(LoadState.LOADING);
    this.#layoutsErrorSubject.next(null);

    const observable: Observable<LayoutModel[]> = this.http.get<Layout[]>('layouts', { params }).pipe(
      map((response: Layout[]): LayoutModel[] => {
        const overlays: Overlay[] = this.#overlaysSubject.getValue();
        return response
          .filter((data: Layout) => data.status === LayoutStatus.ACTIVO)
          .map((data: Layout) => new LayoutModel(data, overlays));
      }),
      tap((layouts: LayoutModel[]) => {
        this.#layoutsSubject.next(layouts);
        this.#layoutsStateSubject.next(LoadState.LOADED);
      }),
      catchError((error: any) => this.handleError<LayoutModel[]>(
        error,
        this.#layoutsErrorSubject,
        this.#layoutsStateSubject,
        'Error fetching layouts',
        []
      )),
      finalize(() => {
        if (this.#layoutsStateSubject.getValue() === LoadState.LOADING) {
          this.#layoutsStateSubject.next(LoadState.LOADED);
        }
      })
    );

    if (autoSubscribe) {
      observable.subscribe();
      return of(this.#layoutsSubject.getValue());
    }

    return observable;
  }

  /**
   * Obtiene las tecnologías
   * @param params Parámetros HTTP opcionales
   */
  fetchTechnologies(params?: HttpParams): void {
    this.#technologiesStateSubject.next(LoadState.LOADING);
    this.#technologiesErrorSubject.next(null);

    this.http.get<Technology[]>('tecnologies', { params })
      .pipe(
        map((response: Technology[]): TechnologyModel[] =>
          response.map((data: Technology) => new TechnologyModel(data))
        ),
        tap((technologies: TechnologyModel[]) => {
          this.#technologiesSubject.next(technologies);
          this.#technologiesStateSubject.next(LoadState.LOADED);
        }),
        catchError((error: any) => this.handleError<TechnologyModel[]>(
          error,
          this.#technologiesErrorSubject,
          this.#technologiesStateSubject,
          'Error fetching technologies',
          []
        )),
        finalize(() => {
          if (this.#technologiesStateSubject.getValue() === LoadState.LOADING) {
            this.#technologiesStateSubject.next(LoadState.LOADED);
          }
        })
      )
      .subscribe();
  }

  /**
   * Obtiene los datos básicos de overlays sin procesar layouts
   * @param params Parámetros HTTP opcionales
   * @returns Observable con los overlays obtenidos (sin layouts completos)
   * @private
   */
  private fetchRawOverlays(params?: HttpParams): Observable<Overlay[]> {
    return this.http.get<IOverlay[]>('overlays', { params }).pipe(
      map((response: IOverlay[]): Overlay[] => {
        const creators: Creator[] = this.#creatorsSubject.getValue();
        const overlays: Overlay[] = response
          .filter((data: IOverlay) => data.status === OverlayStatus.ACTIVO)
          .map((data: IOverlay) =>
            new Overlay({...data, layouts: ''}, creators)
          );
        return overlays;
      }),
      tap((overlays: Overlay[]) => {
        this.#overlaysSubject.next(overlays);
      }),
      catchError((error: any) => this.handleError<Overlay[]>(
        error,
        this.#overlaysErrorSubject,
        this.#overlaysStateSubject,
        'Error fetching raw overlays',
        []
      ))
    );
  }

  /**
   * Carga overlays con datos completos (creadores y layouts)
   * @param params Parámetros HTTP opcionales
   * @returns Observable con los overlays obtenidos (con layouts completos)
   * @private
   */
  private loadOverlaysWithFullData(params?: HttpParams): Observable<Overlay[]> {
    return this.http.get<IOverlay[]>('overlays', { params }).pipe(
      map((response: IOverlay[]): Overlay[] => {
        const creators: Creator[] = this.#creatorsSubject.getValue();
        const layouts: LayoutModel[] = this.#layoutsSubject.getValue();
        return response
          .filter((data: IOverlay) => data.status === OverlayStatus.ACTIVO)
          .map((data: IOverlay) => new Overlay(data, creators, layouts));
      }),
      tap((overlays: Overlay[]) => {
        this.#overlaysSubject.next(overlays);
        this.#overlaysStateSubject.next(LoadState.LOADED);
      }),
      catchError((error: any) => this.handleError<Overlay[]>(
        error,
        this.#overlaysErrorSubject,
        this.#overlaysStateSubject,
        'Error fetching overlays with full data',
        this.#overlaysSubject.getValue()
      ))
    );
  }

  /**
   * Carga los creadores con las redes sociales disponibles
   * @param params Parámetros HTTP opcionales
   * @returns Observable con los creadores obtenidos
   * @private
   */
  private loadCreators(params?: HttpParams): Observable<Creator[]> {
    return this.http.get<ICreator[]>('creators', { params }).pipe(
      map((response: ICreator[]): Creator[] => {
        const socials: Social[] = this.#socialsSubject.getValue();
        return response.map((data: ICreator) => new Creator(data, socials));
      }),
      tap((creators: Creator[]) => {
        this.#creatorsSubject.next(creators);
        this.#creatorsStateSubject.next(LoadState.LOADED);
      }),
      catchError((error: any) => this.handleError<Creator[]>(
        error,
        this.#creatorsErrorSubject,
        this.#creatorsStateSubject,
        'Error fetching creators',
        []
      ))
    );
  }

  /**
   * Método centralizado para manejar errores HTTP
   * @param error Error HTTP o cualquier otro error
   * @param errorSubject Subject para almacenar el error
   * @param stateSubject Subject para almacenar el estado
   * @param logMessage Mensaje para log de error
   * @param fallbackData Datos por defecto en caso de error
   * @returns Observable con los datos por defecto
   * @private
   */
  private handleError<T>(
    error: any,
    errorSubject: BehaviorSubject<ErrorMessage | null>,
    stateSubject: BehaviorSubject<LoadState>,
    logMessage: string,
    fallbackData: T
  ): Observable<T> {
    console.error(logMessage, error);

    const errorMessage: ErrorMessage = {
      message: error instanceof HttpErrorResponse
        ? `${error.status}: ${error.statusText}`
        : error?.message || 'Unknown error',
      status: error instanceof HttpErrorResponse ? error.status : undefined,
      timestamp: new Date()
    };

    errorSubject.next(errorMessage);
    stateSubject.next(LoadState.ERROR);

    return of(fallbackData);
  }
}
