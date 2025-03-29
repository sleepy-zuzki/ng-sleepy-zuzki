import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, input, InputSignal, ViewChild } from '@angular/core';
import { ProjectsComponent } from '@components/projects/projects.component';
import { SocialsComponent } from '@components/socials/socials.component';

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
export class LandingComponent {

}
