import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, ElementRef, OnInit, Signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '@components/header/header.component';
import { ApiService } from '@services/api.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-view',
  imports: [HeaderComponent],
  templateUrl: './view.component.html',
  styleUrl: './view.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ViewComponent implements OnInit {
  views: Signal<any[]>;
  currentView: any;
  @ViewChild('streamerView') viewElement?: ElementRef;

  constructor (
    private route: ActivatedRoute,
    private apiService: ApiService,
  ) {
    this.views = this.apiService.views;

    effect((): void => {
      if (this.views() && this.views().length > 0) {
        this.currentView = this.views()[0];

        if (this.viewElement) {
          this.viewElement.nativeElement.src = this.currentView.content.url;
        }
      }
    })
  }

  ngOnInit(): void {
    const streamer: string | null = this.route.snapshot.paramMap.get('streamer');

    if (streamer !== null) {
      const httpParams: HttpParams = new HttpParams()
      .set('filters[overlay][slug]', streamer)
      .set('populate[thumbnail][fields][0]', 'formats')
      .set('populate[content][fields][0]', 'url');

      this.apiService.fetchOverlayViews(httpParams)
    }
  }
}
