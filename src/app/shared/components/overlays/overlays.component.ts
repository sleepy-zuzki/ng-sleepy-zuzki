import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HeaderComponent } from '@components/header/header.component';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-overlays',
  imports: [
    HeaderComponent,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './overlays.component.html',
  styleUrl: './overlays.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OverlaysComponent {

}
