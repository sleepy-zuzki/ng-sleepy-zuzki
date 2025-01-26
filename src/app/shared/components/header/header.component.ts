import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    RouterLinkActive,
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HeaderComponent {
  @ViewChild('drawer') drawer?: ElementRef;
  currentPath: string = '/overlays'

  constructor(private elementRef: ElementRef) {}

  openDrawer(): void {
    if (this.drawer) {
      this.drawer.nativeElement.open = true
    }
  }
}
