import { Component, effect } from '@angular/core';
import { ProjectCardComponent } from '@components/ui';
import { Overlay } from '@core/models/overlay.model';
import { GithubDataApiService } from '@services/github-data-api.service';

@Component({
  selector: 'app-works-feature',
  imports: [
    ProjectCardComponent
  ],
  templateUrl: './works.feature.html',
  styleUrl: './works.feature.css'
})
export class WorksFeature {
  projects: Overlay[] = [];

  constructor(private apiService: GithubDataApiService) {
    this.apiService.fetchOverlays();
    effect(() => {
      this.projects = this.apiService.overlays();
    });
  }
}
