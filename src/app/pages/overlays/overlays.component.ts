import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, Signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ApiService } from '@services/api.service';
import { Datum } from '@core/Interfaces/StrapiResponse';
import { SkeletonComponent } from '@components/projects/project/skeleton/skeleton.component';

@Component({
  selector: 'app-overlays',
  imports: [
    RouterLink,
    RouterLinkActive,
    SkeletonComponent
  ],
  templateUrl: './overlays.component.html',
  styleUrl: './overlays.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OverlaysComponent implements OnInit {

  overlays: Signal<any[]>;

  constructor(private apiService: ApiService) {
    this.overlays = this.apiService.overlays;
  }

  ngOnInit(): void {
    this.apiService.fetchOverlays();
  }

}
