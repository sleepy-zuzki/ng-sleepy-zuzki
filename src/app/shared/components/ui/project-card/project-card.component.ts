import { Component, Input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ButtonComponent } from '@components/ui';
import { RouterLink } from '@angular/router';

/**
 * Interfaz que define la estructura de datos para un proyecto
 */
export interface Project {
  /** ID único del proyecto */
  id: string;
  /** URL de la imagen del proyecto */
  imageUrl: string;
  /** Título del proyecto */
  title: string;
  /** Año de realización del proyecto */
  year: string | number;
  /** Descripción breve del proyecto */
  description: string;
  /** URL opcional para navegar al detalle del proyecto */
  projectUrl?: string | any[] | null;
}

/**
 * Componente que muestra una tarjeta individual de proyecto
 * con imagen, título, año, descripción y un botón de acción.
 */
@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    RouterLink,
    NgOptimizedImage
  ],
  template: `
    <div class="flex flex-row">
      <img [ngSrc]="project.imageUrl" [alt]="'Imagen de ' + project.title" width="460" height="280"/>

      <div class="flex flex-col px-4 justify-between">
        <div>
          <h3>{{ project.title }}</h3>
          <p class="w-full">{{ project.year }}</p>
          <p>{{ project.description }}</p>
        </div>
        <app-button class="self-start" >
          {{ buttonText }}
        </app-button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      margin-bottom: 1rem;
    }

    h3 {
      margin-top: 0;
      font-size: 1.25rem;
      font-weight: 600;
    }
  `]
})
export class ProjectCardComponent {
  /** Datos completos del proyecto a mostrar */
  @Input({ required: true }) project!: Project;

  /** Texto personalizable para el botón de acción */
  @Input() buttonText: string = 'Ver Proyecto';
}
