import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HeaderComponent } from '@components/header/header.component';

@Component({
  selector: 'app-kirarye',
  imports: [
    HeaderComponent
  ],
  templateUrl: './kirarye.component.html',
  styleUrl: './kirarye.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KiraryeComponent {

}
