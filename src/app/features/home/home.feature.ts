import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, HostListener } from '@angular/core';
import { ButtonComponent, ProjectCardComponent } from '@components/ui';
import { BadgeComponent } from '@components/ui/badge/badge.component';
import { GithubDataApiService } from '@services/github-data-api.service';
import { Overlay } from '@core/models/overlay.model';
import { FormGroup, FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { HotToastService } from '@ngxpert/hot-toast';
import { ContactFormComponent } from '@components/forms/contact-form/contact-form.component';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-home-feature',
  standalone: true,
  imports: [
    ButtonComponent,
    BadgeComponent,
    ProjectCardComponent,
    FormsModule,
    ContactFormComponent,
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



  constructor(
    private apiService: GithubDataApiService,
    private http: HttpClient,
    private toast: HotToastService
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

  onSubmit(form: FormGroup) {
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
        this.toast.show('Tu mensaje ha sido enviado correctamente. Gracias por contactarnos.');
      },
      error: err => {
        // Aquí puedes manejar el error que fue relanzado o uno nuevo
        console.error('Error en la suscripción:', err);
        // Podrías mostrar un mensaje de error al usuario aquí
      }

    });
  }
}
