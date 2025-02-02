import {
  HttpEvent,
  HttpHandlerFn,
  HttpHeaders,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import { environment } from '@env/environment'
import { Observable } from 'rxjs';

export const ApiInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${environment.API_TOKEN}`
  });

  const url: string = `${environment.API_URL}/${req.url}`;
  const newRequest: HttpRequest<unknown> = req.clone({url, headers})
  return next(newRequest);
};
