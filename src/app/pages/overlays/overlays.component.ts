import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { GithubDataApiService } from '@services/github-data-api.service';
import { Overlay } from '@core/models/overlay.model';
import { SkeletonComponent } from '@components/projects/project/skeleton/skeleton.component';
import { OverlayComponent } from '@components/overlays/overlay/overlay.component';

@Component({
  selector: 'app-overlays',
  imports: [
    SkeletonComponent,
    OverlayComponent
  ],
  templateUrl: './overlays.component.html',
  styleUrl: './overlays.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OverlaysComponent implements OnInit {
  overlays: Signal<Overlay[]>;
  loading: WritableSignal<boolean> = signal(true);
  error: WritableSignal<boolean> = signal(false);

  constructor(private githubDataApi: GithubDataApiService) {
    this.overlays = this.githubDataApi.overlays;
  }

  ngOnInit(): void {
    this.loadOverlays();
  }

  loadOverlays(): void {
    this.loading.set(true);
    this.error.set(false);

    this.githubDataApi.fetchOverlays();

    // Simulamos espera para mostrar los skeletons brevemente
    setTimeout(() => {
      if (this.overlays().length === 0) {
        // Si después de 2 segundos no hay datos, asumimos que puede haber un error
        // Normalmente esto sería manejado con un observable de error del servicio
        this.error.set(true);
      }
      this.loading.set(false);
    }, 2000);
  }

  retry(): void {
    this.loadOverlays();
  }
}
