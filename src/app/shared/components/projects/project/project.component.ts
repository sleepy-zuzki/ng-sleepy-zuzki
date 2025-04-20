import { Component, CUSTOM_ELEMENTS_SCHEMA, input, InputSignal } from '@angular/core';
import { Datum } from '@core/interfaces/strapi-response.interface';

@Component({
  selector: 'app-project',
  imports: [],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
/**
 * Componente para mostrar la tarjeta de un proyecto individual.
 */
export class ProjectComponent {
  /**
   * Datos del proyecto a mostrar.
   * Se recibe como una señal de entrada (InputSignal).
   */
  readonly project: InputSignal<Datum | undefined> = input<Datum>();
}
