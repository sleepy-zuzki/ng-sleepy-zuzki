import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, input, InputSignal, OnInit, ViewChild } from '@angular/core';
import { ProjectsComponent } from '@components/projects/projects.component';
import { SocialsComponent } from '@components/socials/socials.component';
import { OverlayService } from '@services/overlay.service';
import { Overlay } from '@core/models/overlay.model';

@Component({
  selector: 'app-landing',
  imports: [
    ProjectsComponent,
    SocialsComponent
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LandingComponent implements OnInit {

  constructor(private overlayService: OverlayService) { }

  ngOnInit(): void {
    this.overlayService.setCurrentOverlay(new Overlay());
  }

}
