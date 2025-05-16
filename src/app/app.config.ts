import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { GithubDataInterceptor } from '@core/interceptors/github-data.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHotToastConfig } from '@ngxpert/hot-toast';
import { provideCloudflareLoader } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([GithubDataInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideCloudflareLoader('https://zuzki.dev'),
    provideRouter(routes),
    provideHotToastConfig(),
    provideAnimations()
  ]
};
