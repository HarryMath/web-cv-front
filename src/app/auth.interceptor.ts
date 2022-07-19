import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {Observable, tap} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthInterceptor implements HttpInterceptor {

  private readonly endpoint = 'http://localhost:80/api/';
  private token: string;

  constructor() {
    this.token = localStorage.getItem('token') || '';
  }

  public setToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authReq = req.url.startsWith('http') ?
      req :
      req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + localStorage.getItem('token')),
        url: this.endpoint + req.url
      });

    // console.log();
    // console.log('request to: ' + authReq.url);
    // console.log('headers: ', authReq.headers);
    // console.log();

    return next.handle(authReq).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            //
          }
        },
        error: (err) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status == 401) {
              console.log('Unauthorized')
            }
          }
        }
      })
    )
  }
}
