import { computed, Injectable, Signal, signal, WritableSignal, isSignal } from '@angular/core';
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
import { Observable, catchError, finalize, map, of, switchMap, tap } from 'rxjs';

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
  // Señales de datos
  #overlays: WritableSignal<Overlay[]> = signal([]);
  #creators: WritableSignal<Creator[]> = signal([]);
  #socials: WritableSignal<Social[]> = signal([]);
  #layouts: WritableSignal<LayoutModel[]> = signal([]);
  #technologies: WritableSignal<TechnologyModel[]> = signal([]);
  // Señales computadas públicas para datos
  overlays: Signal<Overlay[]> = computed(this.#overlays);
  // Señales de estado de carga
  #overlaysState: WritableSignal<LoadState> = signal(LoadState.INIT);
  // Señales computadas públicas para estados de carga
  overlaysState: Signal<LoadState> = computed(this.#overlaysState);
  #creatorsState: WritableSignal<LoadState> = signal(LoadState.INIT);
  creatorsState: Signal<LoadState> = computed(this.#creatorsState);
  #socialsState: WritableSignal<LoadState> = signal(LoadState.INIT);
  socialsState: Signal<LoadState> = computed(this.#socialsState);
  #layoutsState: WritableSignal<LoadState> = signal(LoadState.INIT);
  layoutsState: Signal<LoadState> = computed(this.#layoutsState);
  #technologiesState: WritableSignal<LoadState> = signal(LoadState.INIT);
  technologiesState: Signal<LoadState> = computed(this.#technologiesState);
  creators: Signal<Creator[]> = computed(this.#creators);
  socials: Signal<Social[]> = computed(this.#socials);
  layouts: Signal<LayoutModel[]> = computed(this.#layouts);
  technologies: Signal<TechnologyModel[]> = computed(this.#technologies);
  // Señales de error
  #overlaysError: WritableSignal<ErrorMessage | null> = signal(null);
  // Señales computadas públicas para errores
  overlaysError: Signal<ErrorMessage | null> = computed(this.#overlaysError);
  #creatorsError: WritableSignal<ErrorMessage | null> = signal(null);
  creatorsError: Signal<ErrorMessage | null> = computed(this.#creatorsError);
  #socialsError: WritableSignal<ErrorMessage | null> = signal(null);
  socialsError: Signal<ErrorMessage | null> = computed(this.#socialsError);
  #layoutsError: WritableSignal<ErrorMessage | null> = signal(null);
  layoutsError: Signal<ErrorMessage | null> = computed(this.#layoutsError);
  #technologiesError: WritableSignal<ErrorMessage | null> = signal(null);
  technologiesError: Signal<ErrorMessage | null> = computed(this.#technologiesError);

  constructor(private http: HttpClient) { }

  /**
   * Obtiene los overlays con toda su información relacionada
   * @param params Parámetros HTTP opcionales
   */
  fetchOverlays(params?: HttpParams): void {
    this.#overlaysState.set(LoadState.LOADING);
    this.#overlaysError.set(null);

    const availableCreators: Creator[] = this.#creators();

    if (availableCreators.length === 0) {
      // Si no hay creadores, cargarlos primero
      this.fetchCreators(params, true)
        .pipe(
          switchMap(() => this.fetchOverlaysWithLayouts(params, true)),
          finalize(() => {
            if (this.#overlaysState() === LoadState.LOADING) {
              this.#overlaysState.set(LoadState.LOADED);
            }
          })
        )
        .subscribe();
    } else {
      // Si ya hay creadores, cargar overlays con layouts
      this.fetchOverlaysWithLayouts(params, true)
        .pipe(
          finalize(() => {
            if (this.#overlaysState() === LoadState.LOADING) {
              this.#overlaysState.set(LoadState.LOADED);
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
    this.#overlaysState.set(LoadState.LOADING);
    this.#overlaysError.set(null);

    const availableLayouts = this.#layouts();

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
    this.#socialsState.set(LoadState.LOADING);
    this.#socialsError.set(null);

    const observable = this.http.get<ISocial[]>('socials', { params }).pipe(
      map((response: ISocial[]): Social[] =>
        response.map(data => new Social(data))
      ),
      tap((socials: Social[]) => {
        this.#socials.set(socials);
        this.#socialsState.set(LoadState.LOADED);
      }),
      catchError((error) => this.handleError(
        error,
        this.#socialsError,
        this.#socialsState,
        'Error fetching socials',
        []
      )),
      finalize(() => {
        if (this.#socialsState() === LoadState.LOADING) {
          this.#socialsState.set(LoadState.LOADED);
        }
      })
    );

    if (autoSubscribe) {
      observable.subscribe();
      return of(this.#socials());
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
    this.#creatorsState.set(LoadState.LOADING);
    this.#creatorsError.set(null);

    const availableSocials: Social[] = this.#socials();

    const observable = availableSocials.length === 0
      ? this.fetchSocials(params, false).pipe(
          switchMap(() => this.loadCreators(params))
        )
      : this.loadCreators(params);

    const finalObservable = observable.pipe(
      finalize(() => {
        if (this.#creatorsState() === LoadState.LOADING) {
          this.#creatorsState.set(LoadState.LOADED);
        }
      })
    );

    if (autoSubscribe) {
      finalObservable.subscribe();
      return of(this.#creators());
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
    this.#layoutsState.set(LoadState.LOADING);
    this.#layoutsError.set(null);

    const observable = this.http.get<ILayout[]>('layouts', { params }).pipe(
      map((response: ILayout[]): LayoutModel[] => {
        const overlays: Overlay[] = this.#overlays();
        return response
          .filter((data: ILayout) => data.status === LayoutStatus.ACTIVO)
          .map((data: ILayout) => new LayoutModel(data, overlays));
      }),
      tap((layouts: LayoutModel[]) => {
        this.#layouts.set(layouts);
        this.#layoutsState.set(LoadState.LOADED);
      }),
      catchError((error) => this.handleError(
        error,
        this.#layoutsError,
        this.#layoutsState,
        'Error fetching layouts',
        []
      )),
      finalize(() => {
        if (this.#layoutsState() === LoadState.LOADING) {
          this.#layoutsState.set(LoadState.LOADED);
        }
      })
    );

    if (autoSubscribe) {
      observable.subscribe();
      return of(this.#layouts());
    }

    return observable;
  }

  /**
   * Obtiene las tecnologías
   * @param params Parámetros HTTP opcionales
   */
  fetchTechnologies(params?: HttpParams): void {
    this.#technologiesState.set(LoadState.LOADING);
    this.#technologiesError.set(null);

    this.http.get<ITechnology[]>('tecnologies', { params })
      .pipe(
        map((response: ITechnology[]): TechnologyModel[] =>
          response.map((data: ITechnology) => new TechnologyModel(data))
        ),
        tap((technologies: TechnologyModel[]) => {
          this.#technologies.set(technologies);
          this.#technologiesState.set(LoadState.LOADED);
        }),
        catchError((error) => this.handleError(
          error,
          this.#technologiesError,
          this.#technologiesState,
          'Error fetching technologies',
          []
        )),
        finalize(() => {
          if (this.#technologiesState() === LoadState.LOADING) {
            this.#technologiesState.set(LoadState.LOADED);
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
        const creators: Creator[] = this.#creators();
        const overlays: Overlay[] = response
          .filter((data: IOverlay) => data.status === OverlayStatus.ACTIVO)
          .map((data: IOverlay) =>
            new Overlay({...data, layouts: ''}, creators)
          );
        return overlays;
      }),
      tap((overlays: Overlay[]) => {
        this.#overlays.set(overlays);
      }),
      catchError((error) => this.handleError(
        error,
        this.#overlaysError,
        this.#overlaysState,
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
        const creators: Creator[] = this.#creators();
        const layouts: LayoutModel[] = this.#layouts();
        return response
          .filter((data: IOverlay) => data.status === OverlayStatus.ACTIVO)
          .map((data: IOverlay) => new Overlay(data, creators, layouts));
      }),
      tap((overlays: Overlay[]) => {
        this.#overlays.set(overlays);
        this.#overlaysState.set(LoadState.LOADED);
      }),
      catchError((error) => this.handleError(
        error,
        this.#overlaysError,
        this.#overlaysState,
        'Error fetching overlays with full data',
        this.#overlays()
      ))
    );
  }

  /**
   * Carga los creadores con las redes sociales disponibles
   */
  private loadCreators(params?: HttpParams): Observable<Creator[]> {
    return this.http.get<ICreator[]>('creators', { params }).pipe(
      map((response: ICreator[]): Creator[] => {
        const socials = this.#socials();
        return response.map(data => new Creator(data, socials));
      }),
      tap((creators: Creator[]) => {
        this.#creators.set(creators);
        this.#creatorsState.set(LoadState.LOADED);
      }),
      catchError((error) => this.handleError(
        error,
        this.#creatorsError,
        this.#creatorsState,
        'Error fetching creators',
        []
      ))
    );
  }

  /**
   * Método centralizado para manejar errores HTTP
   * @param error Error HTTP
   * @param errorSignal Señal para almacenar el error
   * @param stateSignal Señal para almacenar el estado
   * @param logMessage Mensaje para log de error
   * @param fallbackData Datos por defecto en caso de error
   */
  private handleError<T>(
    error: any,
    errorSignal: WritableSignal<ErrorMessage | null>,
    stateSignal: WritableSignal<LoadState>,
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

    errorSignal.set(errorMessage);
    stateSignal.set(LoadState.ERROR);

    return of(fallbackData);
  }
}
