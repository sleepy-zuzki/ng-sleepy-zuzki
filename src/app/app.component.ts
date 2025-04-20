import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA, effect,
  ElementRef,
  Signal,
  ViewChild
} from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Overlay } from '@core/models/overlay.model';
import { GithubDataApiService } from '@services/github-data-api.service';
import { LayoutModel } from '@core/models/layout.model';
import { OverlayService } from '@services/overlay.service';

@Component({
  selector: 'app-root',
    imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  @ViewChild('drawer') drawer?: ElementRef;
  title: string = 'Sleepy Zuzki';
  readonly overlays: Signal<Overlay[]>;

  constructor (
    readonly apiService: GithubDataApiService,
    readonly overlayService: OverlayService
  ) {
    this.overlays = this.apiService.overlays;
  }

  openDrawer(): void {
    if (this.drawer) {
      this.drawer.nativeElement.open = true;
    }
  }

  closeDrawer(): void {
    if (this.drawer) {
      this.drawer.nativeElement.open = false;
    }
  }

  changeLayout(layout_id: string): void {
    const reqLayout: LayoutModel | undefined = this.overlayService.overlayLayouts().find((layout: LayoutModel) => layout.id === layout_id);
    if (reqLayout) {
      this.overlayService.setCurrentLayout(reqLayout);
      this.closeDrawer();
    }
  }
}
