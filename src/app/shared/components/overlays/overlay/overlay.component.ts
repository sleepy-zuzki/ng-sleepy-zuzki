import { Component, CUSTOM_ELEMENTS_SCHEMA, input, InputSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Overlay } from '@core/models/overlay.model';
import { GithubDataApiService } from '@services/github-data-api.service';

@Component({
  selector: 'app-overlay',
  imports: [RouterLink],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OverlayComponent {
  readonly overlay: InputSignal<Overlay | undefined> = input<Overlay>();

  constructor(private githubDataApi: GithubDataApiService) {
    console.log(this.overlay());
  }
} 