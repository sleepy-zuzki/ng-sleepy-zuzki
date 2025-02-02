import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, Signal } from '@angular/core';
import { HeaderComponent } from '@components/header/header.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ApiService } from '@services/api.service';
import { Datum } from '@core/Interfaces/StrapiResponse';
import { SkeletonComponent } from '@components/projects/project/skeleton/skeleton.component';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-overlays',
  imports: [
    HeaderComponent,
    RouterLink,
    RouterLinkActive,
    SkeletonComponent
  ],
  templateUrl: './overlays.component.html',
  styleUrl: './overlays.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OverlaysComponent implements OnInit {

  overlays: Signal<Datum[]>;

  constructor(private apiService: ApiService) {
    this.overlays = this.apiService.overlays;
  }

  ngOnInit(): void {
    const httpParams: HttpParams = new HttpParams()
    .set('populate[screenshot][fields][0]', 'formats')
    .set('populate[creators][fields]', '*')
    .set('fields[0]', 'id')
    .set('fields[1]', 'streamer')
    .set('fields[2]', 'slug');

    this.apiService.fetchOverlays(httpParams);
  }

}
