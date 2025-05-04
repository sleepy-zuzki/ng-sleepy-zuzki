import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, HostListener } from '@angular/core';
import { TextareaComponent, InputComponent, ButtonComponent, ProjectCardComponent } from '@components/ui';
import { BadgeComponent } from '@components/ui/badge/badge.component';
import { NgOptimizedImage } from '@angular/common';
import { GithubDataApiService } from '@services/github-data-api.service';
import { Overlay } from '@core/models/overlay.model';

@Component({
  selector: 'app-home-feature',
  standalone: true,
  imports: [
    ButtonComponent,
    InputComponent,
    TextareaComponent,
    BadgeComponent,
    ProjectCardComponent,
    NgOptimizedImage
  ],
  templateUrl: './home.feature.html',
  styleUrl: './home.feature.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
/**
 * Componente que representa la característica de la página de inicio (Home Page) de la aplicación.
 * Muestra componentes como Proyectos y Redes Sociales.
 */
export class HomeFeatureComponent {
  technologies: string[] = ['Javascript', 'React', 'Node.js', 'Express', 'HTML5', 'CSS3', 'MongoDB', 'PostgreSQL', 'Git', 'AWS', 'Docker', 'Webpack'];
  projects: Overlay[] = [];
  windowWidth: number = 0;

  constructor(private apiService: GithubDataApiService) {
    this.apiService.fetchOverlays();
    this.windowWidth = window.innerWidth;
    effect(() => {
      this.projects = this.apiService.overlays();
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowWidth = window.innerWidth;
  }
}
