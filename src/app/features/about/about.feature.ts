import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Project, ProjectCardComponent } from '@components/ui';

@Component({
  selector: 'app-about-feature',
  imports: [
    NgOptimizedImage,
    ProjectCardComponent
  ],
  templateUrl: './about.feature.html',
  styleUrl: './about.feature.css'
})
export class AboutFeatureComponent {
  projects: Project[] = [
    {
      id: 'project1',
      imageUrl: 'https://placehold.co/460x280',
      title: 'Proyecto 1',
      year: 2023,
      description: 'Una plataforma para gestionar tareas y colaborar con miembros del equipo eficazmente.'
    }
  ];
}
