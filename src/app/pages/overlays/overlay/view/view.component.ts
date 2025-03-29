import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, ElementRef, OnInit, Signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '@services/api.service';

@Component({
  selector: 'app-view',
  imports: [],
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
      this.apiService.fetchOverlayViews()
    }
  }
}
