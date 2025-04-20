import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  imports: [],
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
/**
 * Componente para mostrar un esqueleto de carga (placeholder)
 * mientras se obtienen los datos de un proyecto.
 */
export class SkeletonComponent {

}
