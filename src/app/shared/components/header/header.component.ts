import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  signal,
  ViewChild, WritableSignal
} from '@angular/core';
import { NavigationStart, Router, RouterLink, RouterLinkActive } from '@angular/router';

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
  readonly showDrawer: WritableSignal<boolean> = signal(true);

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        switch(event.url) {
          case '/':
          case '/overlays':
            this.showDrawer.set(false);
            break;
          default:
            this.showDrawer.set(true);
            break;
        }
      }
    })
  }

  openDrawer(): void {
    if (this.drawer) {
      this.drawer.nativeElement.open = true
    }
  }
}
