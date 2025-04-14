import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, Signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { GithubDataApiService } from '@services/github-data-api.service';
import { Overlay } from '@core/models/overlay.model';
import { SkeletonComponent } from '@components/projects/project/skeleton/skeleton.component';
import { OverlayComponent } from '@components/overlays/overlay/overlay.component';

@Component({
  selector: 'app-overlays',
  imports: [
    RouterLink,
    RouterLinkActive,
    SkeletonComponent,
    OverlayComponent
  ],
  templateUrl: './overlays.component.html',
  styleUrl: './overlays.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OverlaysComponent implements OnInit {
  overlays: Signal<Overlay[]>;

  constructor(private githubDataApi: GithubDataApiService) {
    this.overlays = this.githubDataApi.overlays;
  }

  ngOnInit(): void {
    this.githubDataApi.fetchOverlays();
  }
}
