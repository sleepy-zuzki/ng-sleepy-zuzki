import { Component, effect, HostListener } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ProjectCardComponent } from '@components/ui';
import { Overlay } from '@core/models/overlay.model';
import { GithubDataApiService } from '@services/github-data-api.service';

@Component({
  selector: 'app-about-feature',
  imports: [
    NgOptimizedImage,
    ProjectCardComponent
  ],
  templateUrl: './about.feature.html',
  styleUrl: './about.feature.css'
})
export class AboutFeatureComponent {
  projects: Overlay[] = [];
  windowWidth: number = 0;

  constructor (
    private apiService: GithubDataApiService
  ) {
    this.apiService.fetchOverlays();
    effect(() => {
      this.projects = this.apiService.overlays();
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowWidth = window.innerWidth;
  }
}
