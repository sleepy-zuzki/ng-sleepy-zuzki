import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

@Injectable({
  providedIn: 'root'
})
export class GithubDataApiService {
  #overlays: WritableSignal<Overlay[]> = signal([]);
  #creators: WritableSignal<Creator[]> = signal([]);
  #socials: WritableSignal<Social[]> = signal([]);
  #layouts: WritableSignal<LayoutModel[]> = signal([]);
  #technologies: WritableSignal<TechnologyModel[]> = signal([]);

  overlays: Signal<Overlay[]> = computed(this.#overlays);
  creators: Signal<Creator[]> = computed(this.#creators);
  socials: Signal<Social[]> = computed(this.#socials);
  layouts: Signal<LayoutModel[]> = computed(this.#layouts);
  technologies: Signal<TechnologyModel[]> = computed(this.#technologies);

  constructor(private http: HttpClient) { }

  fetchOverlays(params?: HttpParams): void {
    // Verificar si hay creadores cargados
    const availableCreators = this.#creators();

    if (availableCreators.length === 0) {
      // Si no hay creadores, cargarlos primero
      this.fetchCreators();
      // Esperar a que los creadores estén cargados antes de cargar overlays
      setTimeout(() => this.fetchOverlaysWithLayouts(params), 500);
    } else {
      // Si ya hay creadores, cargar overlays con layouts
      this.fetchOverlaysWithLayouts(params);
    }
  }

  // Método para obtener overlays con layouts
  private fetchOverlaysWithLayouts(params?: HttpParams): void {
    // Verificar si hay layouts cargados
    const availableLayouts = this.#layouts();

    if (availableLayouts.length === 0) {
      // Si no hay layouts, obtener overlays básicos primero
      this.fetchRawOverlays(params, () => {
        // Luego cargar layouts
        this.fetchLayouts(params);
        // Finalmente, actualizar overlays con layouts completos
        setTimeout(() => this.loadOverlaysWithFullData(params), 300);
      });
    } else {
      // Si ya hay layouts, cargar overlays con datos completos
      this.loadOverlaysWithFullData(params);
    }
  }

  // Método para cargar overlays con datos completos (creadores y layouts)
  private loadOverlaysWithFullData(params?: HttpParams): void {
    this.http.get<IOverlay[]>('overlays', { params })
      .subscribe({
        next: (response: IOverlay[]): void => {
          const creators = this.#creators();
          const layouts = this.#layouts();
          const overlays = response.map(data => new Overlay(data, creators, layouts));
          this.#overlays.set(overlays);
        },
        error: (error): void => {
          console.error('Error fetching overlays with full data:', error);
          // Mantener overlays existentes en caso de error
        }
      });
  }

  // Método para obtener datos básicos de overlays (sin procesar layouts)
  private fetchRawOverlays(params?: HttpParams, callback?: () => void): void {
    this.http.get<IOverlay[]>('overlays', { params })
      .subscribe({
        next: (response: IOverlay[]): void => {
          const creators = this.#creators();
          // Crear overlays básicos sin procesar layouts
          const overlays = response.map(data => new Overlay({...data, layouts: ''}, creators));
          this.#overlays.set(overlays);
          if (callback) callback();
        },
        error: (error): void => {
          console.error('Error fetching raw overlays:', error);
          this.#overlays.set([]);
          if (callback) callback();
        }
      });
  }

  fetchSocials(params?: HttpParams): void {
    this.http.get<ISocial[]>('socials', { params })
      .subscribe({
        next: (response: ISocial[]): void => {
          const socials = response.map(data => new Social(data));
          this.#socials.set(socials);
        },
        error: (error): void => {
          console.error('Error fetching socials:', error);
          this.#socials.set([]);
        }
      });
  }

  fetchCreators(params?: HttpParams): void {
    // Verificar si hay redes sociales cargadas
    const availableSocials = this.#socials();

    if (availableSocials.length === 0) {
      // Si no hay redes sociales, cargarlas primero y luego cargar los creadores
      this.fetchSocials();

      // Esperar a que las redes sociales estén cargadas antes de cargar creadores
      setTimeout(() => this.loadCreators(params), 300);
    } else {
      // Si ya hay redes sociales, cargar creadores directamente
      this.loadCreators(params);
    }
  }

  // Método privado para cargar creadores (evita duplicación de código)
  private loadCreators(params?: HttpParams): void {
    this.http.get<ICreator[]>('creators', { params })
      .subscribe({
        next: (response: ICreator[]): void => {
          const socials = this.#socials();
          const creators = response.map(data => new Creator(data, socials));
          this.#creators.set(creators);
        },
        error: (error): void => {
          console.error('Error fetching creators:', error);
          this.#creators.set([]);
        }
      });
  }

  fetchLayouts(params?: HttpParams): void {
    // Siempre cargar layouts directamente
    this.loadLayouts(params);
  }

  // Método privado para cargar layouts
  private loadLayouts(params?: HttpParams): void {
    this.http.get<ILayout[]>('layouts', { params })
      .subscribe({
        next: (response: ILayout[]): void => {
          const overlays = this.#overlays();
          const layouts = response.map(data => new LayoutModel(data, overlays));
          this.#layouts.set(layouts);
        },
        error: (error): void => {
          console.error('Error fetching layouts:', error);
          this.#layouts.set([]);
        }
      });
  }

  fetchTechnologies(params?: HttpParams): void {
    this.http.get<ITechnology[]>('tecnologies', { params })
      .subscribe({
        next: (response: ITechnology[]): void => {
          const technologies = response.map(data => new TechnologyModel(data));
          this.#technologies.set(technologies);
        },
        error: (error): void => {
          console.error('Error fetching technologies:', error);
          this.#technologies.set([]);
        }
      });
  }
}
