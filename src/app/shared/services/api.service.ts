import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  #projects: WritableSignal<[]> = signal([]);
  projects: Signal<[]> = computed(this.#projects);

  #overlays: WritableSignal<[]> = signal([]);
  overlays: Signal<[]> = computed(this.#overlays);

  #views: WritableSignal<[]> = signal([]);
  views: Signal<any[]> = computed(this.#views);

  constructor(private http: HttpClient) { }

  fetchProjects(params?: HttpParams): void {
    if (this.projects().length === 0) {
      this.http.get<any>(`projects`, {params})
      .subscribe((res: any): void => this.#projects.set(res.data));
    }
  }

  fetchOverlays(params?: HttpParams): void {
    this.http.get<any>(`overlays`, {params})
    .subscribe((res: any): void => this.#overlays.set(res));
  }

  fetchOverlayViews(params?: HttpParams): void {
    this.http.get<any>(`views`, {params})
    .subscribe((res: any): void => {
      this.#views.set(res)
    });
  }
}
