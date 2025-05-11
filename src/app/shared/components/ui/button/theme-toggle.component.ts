import { Component, Inject, Renderer2 } from '@angular/core';
import { ButtonComponent } from '@components/ui/button/button.component';
import { FaIconComponent, IconDefinition } from '@fortawesome/angular-fontawesome';
import { faMoon, faSun } from '@awesome.me/kit-15d5a6a4b5/icons/duotone/solid';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  template: `
    <app-button variant="secondary" ariaLabel="Alternar tema" (callback)="toggleDarkMode()">
      <fa-icon [icon]="faMoon" class="dark:hidden"></fa-icon>
      <fa-icon [icon]="faSun" class="hidden dark:block"></fa-icon>
    </app-button>
  `,
  imports: [
    ButtonComponent,
    FaIconComponent
  ],
  styles: []
})
export class ThemeToggleComponent {
  protected readonly faMoon: IconDefinition = faMoon;
  protected readonly faSun: IconDefinition = faSun;
  private isDarkMode: boolean = false;

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document) {
    this.checkInitialMode();
  }

  checkInitialMode(): void {
    const isDarkMode: string | null = localStorage.getItem('darkMode');

    if (isDarkMode === 'true' || (!isDarkMode && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      this.setDarkMode(true);
    } else {
      this.setDarkMode(false);
    }
  }

  toggleDarkMode(): void {
    this.setDarkMode(!this.isDarkMode);
  }

  setDarkMode(isDarkMode: boolean): void {
    this.isDarkMode = isDarkMode;
    if (isDarkMode) {
      this.renderer.addClass(this.document.documentElement, 'dark');
      localStorage.setItem('darkMode', 'true'); // Guarda la preferencia
    } else {
      this.renderer.removeClass(this.document.documentElement, 'dark');
      localStorage.setItem('darkMode', 'false'); // Guarda la preferencia
    }
  }
}
