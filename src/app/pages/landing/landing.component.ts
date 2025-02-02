import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AboutComponent } from '@components/about/about.component';
import { HeaderComponent } from '@components/header/header.component';
import { ProjectsComponent } from '@components/projects/projects.component';
import { SocialsComponent } from '@components/socials/socials.component';

@Component({
  selector: 'app-landing',
    imports: [
        AboutComponent,
        HeaderComponent,
        ProjectsComponent,
        SocialsComponent
    ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LandingComponent {

}
