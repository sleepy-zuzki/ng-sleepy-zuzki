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
    this.http.get<IOverlay[]>('data/overlays.json', { params })
      .subscribe({
        next: (response: IOverlay[]): void => {
          const overlays = response.map(data => new Overlay(data));
          this.#overlays.set(overlays);
        },
        error: (error): void => {
          console.error('Error fetching overlays:', error);
          this.#overlays.set([]);
        }
      });
  }

  fetchSocials(params?: HttpParams): void {
    this.http.get<ISocial[]>('data/socials.json', { params })
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
    this.http.get<ICreator[]>('data/creators.json', { params })
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
    this.http.get<ILayout[]>('data/layouts.json', { params })
      .subscribe({
        next: (response: ILayout[]): void => {
          const layouts = response.map(data => new LayoutModel(data));
          this.#layouts.set(layouts);
        },
        error: (error): void => {
          console.error('Error fetching layouts:', error);
          this.#layouts.set([]);
        }
      });
  }

  fetchTechnologies(params?: HttpParams): void {
    this.http.get<ITechnology[]>('data/tecnologies.json', { params })
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