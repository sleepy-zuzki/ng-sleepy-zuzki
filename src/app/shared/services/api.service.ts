import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Datum, StrapiResponse } from '@core/Interfaces/StrapiResponse';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  #projects: WritableSignal<Datum[]> = signal([]);
  projects: Signal<Datum[]> = computed(this.#projects);

  #overlays: WritableSignal<Datum[]> = signal([]);
  overlays: Signal<Datum[]> = computed(this.#overlays);

  #views: WritableSignal<Datum[]> = signal([]);
  views: Signal<any[]> = computed(this.#views);

  constructor(private http: HttpClient) { }

  fetchProjects(params?: HttpParams): void {
    if (this.projects().length === 0) {
      this.http.get<StrapiResponse>(`api/projects`, {params})
      .subscribe((res: StrapiResponse): void => this.#projects.set(res.data));
    }
  }

  fetchOverlays(params?: HttpParams): void {
    this.http.get<StrapiResponse>(`api/overlays`, {params})
    .subscribe((res: StrapiResponse): void => this.#overlays.set(res.data));
  }

  fetchOverlayViews(params?: HttpParams): void {
    this.http.get<StrapiResponse>(`api/views`, {params})
    .subscribe((res: StrapiResponse): void => {
      console.log(res);
      this.#views.set(res.data ?? [])
    });
  }
}
