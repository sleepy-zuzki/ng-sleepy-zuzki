import { computed, Injectable, Signal, signal, WritableSignal, isSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Overlay } from '@core/models/overlay.model';
import { Overlay as IOverlay } from '@core/interfaces/overlay.interface';
import { Creator } from '@core/models/creator.model';
import { Creator as ICreator } from '@core/interfaces/creator.interface';
import { Social } from '@core/models/social.model';
import { Social as ISocial } from '@core/interfaces/social.interface';
import { LayoutModel } from '@core/models/layout.model';
import { ILayout } from '@core/interfaces/layout.interface';
import { TechnologyModel } from '@core/models/technology.model';
import { ITechnology } from '@core/interfaces/technology.interface';
import { OverlayStatus } from '@core/enums/overlays.enum';
import { LayoutStatus } from '@core/enums/layout.enum';
import { LoadState } from '@core/enums/load-state.enum';
import { BehaviorSubject, Observable, catchError, finalize, map, of, switchMap, tap } from 'rxjs';

/**
 * Interfaz para el mensaje de error
 */
export interface ErrorMessage {
  message: string;
  status?: number;
  timestamp: Date;
}

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
  // BehaviorSubjects para datos
  #overlaysSubject = new BehaviorSubject<Overlay[]>([]);
  #creatorsSubject = new BehaviorSubject<Creator[]>([]);
  #socialsSubject = new BehaviorSubject<Social[]>([]);
  #layoutsSubject = new BehaviorSubject<LayoutModel[]>([]);
  #technologiesSubject = new BehaviorSubject<TechnologyModel[]>([]);
  // BehaviorSubjects para estados de carga
  #overlaysStateSubject = new BehaviorSubject<LoadState>(LoadState.INIT);
  #creatorsStateSubject = new BehaviorSubject<LoadState>(LoadState.INIT);
  #socialsStateSubject = new BehaviorSubject<LoadState>(LoadState.INIT);
  #layoutsStateSubject = new BehaviorSubject<LoadState>(LoadState.INIT);
  #technologiesStateSubject = new BehaviorSubject<LoadState>(LoadState.INIT);
  // BehaviorSubjects para errores
  #overlaysErrorSubject = new BehaviorSubject<ErrorMessage | null>(null);
  #creatorsErrorSubject = new BehaviorSubject<ErrorMessage | null>(null);
  #socialsErrorSubject = new BehaviorSubject<ErrorMessage | null>(null);
  #layoutsErrorSubject = new BehaviorSubject<ErrorMessage | null>(null);
  #technologiesErrorSubject = new BehaviorSubject<ErrorMessage | null>(null);

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
   * @param params Parámetros HTTP opcionales
   * @param autoSubscribe Si es true, autogestiona la suscripción
   */
  fetchOverlaysWithLayouts(
    params?: HttpParams,
    autoSubscribe = false
  ): Observable<Overlay[]> {
    this.#overlaysStateSubject.next(LoadState.LOADING);
    this.#overlaysErrorSubject.next(null);

    const availableLayouts = this.#layoutsSubject.getValue();

    const observable = availableLayouts.length === 0
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
   */
  fetchSocials(
    params?: HttpParams,
    autoSubscribe = true
  ): Observable<Social[]> {
    this.#socialsStateSubject.next(LoadState.LOADING);
    this.#socialsErrorSubject.next(null);

    const observable = this.http.get<ISocial[]>('socials', { params }).pipe(
      map((response: ISocial[]): Social[] =>
        response.map(data => new Social(data))
      ),
      tap((socials: Social[]) => {
        this.#socialsSubject.next(socials);
        this.#socialsStateSubject.next(LoadState.LOADED);
      }),
      catchError((error) => this.handleError(
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
   * @param params Parámetros HTTP opcionales
   * @param autoSubscribe Si es true, autogestiona la suscripción
   */
  fetchCreators(
    params?: HttpParams,
    autoSubscribe = true
  ): Observable<Creator[]> {
    this.#creatorsStateSubject.next(LoadState.LOADING);
    this.#creatorsErrorSubject.next(null);

    const availableSocials: Social[] = this.#socialsSubject.getValue();

    const observable = availableSocials.length === 0
      ? this.fetchSocials(params, false).pipe(
          switchMap(() => this.loadCreators(params))
        )
      : this.loadCreators(params);

    const finalObservable = observable.pipe(
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
   */
  fetchLayouts(
    params?: HttpParams,
    autoSubscribe = true
  ): Observable<LayoutModel[]> {
    this.#layoutsStateSubject.next(LoadState.LOADING);
    this.#layoutsErrorSubject.next(null);

    const observable = this.http.get<ILayout[]>('layouts', { params }).pipe(
      map((response: ILayout[]): LayoutModel[] => {
        const overlays: Overlay[] = this.#overlaysSubject.getValue();
        return response
          .filter((data: ILayout) => data.status === LayoutStatus.ACTIVO)
          .map((data: ILayout) => new LayoutModel(data, overlays));
      }),
      tap((layouts: LayoutModel[]) => {
        this.#layoutsSubject.next(layouts);
        this.#layoutsStateSubject.next(LoadState.LOADED);
      }),
      catchError((error) => this.handleError(
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
   * Implementado con toSignal
   */
  fetchTechnologies(params?: HttpParams): void {
    this.#technologiesStateSubject.next(LoadState.LOADING);
    this.#technologiesErrorSubject.next(null);

    this.http.get<ITechnology[]>('tecnologies', { params })
      .pipe(
        map((response: ITechnology[]): TechnologyModel[] =>
          response.map((data: ITechnology) => new TechnologyModel(data))
        ),
        tap((technologies: TechnologyModel[]) => {
          this.#technologiesSubject.next(technologies);
          this.#technologiesStateSubject.next(LoadState.LOADED);
        }),
        catchError((error) => this.handleError(
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
      catchError((error) => this.handleError(
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
      catchError((error) => this.handleError(
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
   */
  private loadCreators(params?: HttpParams): Observable<Creator[]> {
    return this.http.get<ICreator[]>('creators', { params }).pipe(
      map((response: ICreator[]): Creator[] => {
        const socials = this.#socialsSubject.getValue();
        return response.map(data => new Creator(data, socials));
      }),
      tap((creators: Creator[]) => {
        this.#creatorsSubject.next(creators);
        this.#creatorsStateSubject.next(LoadState.LOADED);
      }),
      catchError((error) => this.handleError(
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
   * @param error Error HTTP
   * @param errorSubject Subject para almacenar el error
   * @param stateSubject Subject para almacenar el estado
   * @param logMessage Mensaje para log de error
   * @param fallbackData Datos por defecto en caso de error
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
