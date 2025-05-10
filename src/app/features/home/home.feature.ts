import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, HostListener } from '@angular/core';
import { TextareaComponent, InputComponent, ButtonComponent, ProjectCardComponent } from '@components/ui';
import { BadgeComponent } from '@components/ui/badge/badge.component';
import { NgOptimizedImage } from '@angular/common';
import { GithubDataApiService } from '@services/github-data-api.service';
import { Overlay } from '@core/models/overlay.model';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, pipe, throwError } from 'rxjs';
import { ResponsiveImgComponent } from '@components/ui/responsive-img/responsive-img.component';

@Component({
  selector: 'app-home-feature',
  standalone: true,
  imports: [
    ButtonComponent,
    InputComponent,
    TextareaComponent,
    BadgeComponent,
    ProjectCardComponent,
    NgOptimizedImage,
    FormsModule,
    ResponsiveImgComponent
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

  formData = {
    name: '',
    email: '',
    message: ''
  }

  constructor(
    private apiService: GithubDataApiService,
    private http: HttpClient
  ) {
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

  onSubmit(form: NgForm) {
    if (form.invalid) {
      console.error('Formulario Invalido');
      return;
    }

    const url = "https://hook.us2.make.com/zl0p2vv4190wklivjadktnec326qzqs6";
    const values = form.value;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }

    this.http.post(url, values, httpOptions)
    .pipe(
      catchError(error => {
        console.error(error);
        return throwError(() => new Error('Ocurrió un error al enviar el formulario. Por favor, inténtalo de nuevo.'));
      })
    )
    .subscribe({
      next: data => {
        form.reset();

        this.formData = {
          name: '',
          email: '',
          message: ''
        };
      },
      error: err => {
        // Aquí puedes manejar el error que fue relanzado o uno nuevo
        console.error('Error en la suscripción:', err);
        // Podrías mostrar un mensaje de error al usuario aquí
      }

    });
  }
}
