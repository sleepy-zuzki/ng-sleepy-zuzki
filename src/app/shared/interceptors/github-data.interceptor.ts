import {
  HttpEvent,
  HttpHandlerFn,
  HttpHeaders,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

export const GithubDataInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>, 
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  // Verificar si la URL comienza con 'data/'

  const headers: HttpHeaders = new HttpHeaders({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  });

  const url: string = `${environment.GITHUB_DATA_URL}/${req.url}`;
  const newRequest: HttpRequest<unknown> = req.clone({ url, headers });
  return next(newRequest);
}; 