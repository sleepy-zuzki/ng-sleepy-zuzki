import { Component, CUSTOM_ELEMENTS_SCHEMA, input, InputSignal } from '@angular/core';
import { Datum } from '@core/Interfaces/StrapiResponse';

@Component({
  selector: 'app-project',
  imports: [

  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProjectComponent {
  readonly project: InputSignal<Datum> = input<Datum>({});
}
