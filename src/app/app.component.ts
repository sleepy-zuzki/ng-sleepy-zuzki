import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, input, InputSignal, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
    imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  @ViewChild('drawer') drawer?: ElementRef;
  title = 'Sleepy Zuzki';
  readonly views: InputSignal<any[]> = input<any[]>([]);

  openDrawer(): void {
    if (this.drawer) {
      this.drawer.nativeElement.open = true;
    }
  }
}
