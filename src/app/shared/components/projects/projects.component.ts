import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ProjectComponent } from '@components/projects/project/project.component';

@Component({
  selector: 'app-projects',
  imports: [
    ProjectComponent
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProjectsComponent {

}
