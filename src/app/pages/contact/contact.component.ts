import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [],
  template: `<h1>Contacto</h1>`,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContactComponent {
  // Logic moved to HomeFeatureComponent
}
