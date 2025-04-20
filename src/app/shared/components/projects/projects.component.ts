import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, Signal } from '@angular/core';
import { ProjectComponent } from '@components/projects/project/project.component';
import { SkeletonComponent } from '@components/projects/project/skeleton/skeleton.component';

@Component({
  selector: 'app-projects',
  imports: [
    ProjectComponent,
    SkeletonComponent
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
/**
 * Componente contenedor para mostrar la lista de proyectos.
 */
export class ProjectsComponent { }
