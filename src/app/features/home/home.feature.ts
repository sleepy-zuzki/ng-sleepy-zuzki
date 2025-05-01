import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { OverlayService } from '@services/overlay.service';
import { TextareaComponent, InputComponent, ButtonComponent, ProjectCardComponent } from '@components/ui';
import { BadgeComponent } from '@components/ui/badge/badge.component';
import { Project } from '@components/ui/project-card/project-card.component';
import { NgOptimizedImage } from '@angular/common';

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
export class HomeFeatureComponent implements OnInit {
  technologies: string[] = ['Javascript', 'React', 'Node.js', 'Express', 'HTML5', 'CSS3', 'MongoDB', 'PostgreSQL', 'Git', 'AWS', 'Docker', 'Webpack'];

  /**
   * Lista de proyectos a mostrar en la sección de proyectos
   */
  projects: Project[] = [
    {
      id: 'project1',
      imageUrl: 'https://placehold.co/460x280',
      title: 'Proyecto 1',
      year: 2023,
      description: 'Una plataforma para gestionar tareas y colaborar con miembros del equipo eficazmente.'
    },
    {
      id: 'project2',
      imageUrl: 'https://placehold.co/460x280',
      title: 'Proyecto 2',
      year: 2023,
      description: 'Una plataforma para gestionar tareas y colaborar con miembros del equipo eficazmente.'
    },
    {
      id: 'project3',
      imageUrl: 'https://placehold.co/460x280',
      title: 'Proyecto 3',
      year: 2023,
      description: 'Una plataforma para gestionar tareas y colaborar con miembros del equipo eficazmente.'
    }
  ];

  /**
   * @param overlayService Servicio para gestionar el estado del overlay seleccionado.
   */
  constructor(private overlayService: OverlayService) { }

  /**
   * Hook del ciclo de vida que se ejecuta al inicializar el componente.
   * Resetea el overlay actual en el servicio al cargar la página de inicio.
   */
  ngOnInit(): void {
    // Asegura que no haya ningún overlay seleccionado al mostrar la página de inicio
    this.overlayService.setCurrentOverlay(null);
  }
}
