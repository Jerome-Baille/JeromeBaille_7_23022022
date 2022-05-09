import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable()
export class AuthGuardInterceptor implements HttpInterceptor {
  tempData: any = [];

  constructor(
    private authService: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {    
    return next.handle(req).pipe(catchError(err => {
      if ([500, 404, 401, 400].includes(err.status)) {
        return next.handle(req)
      } else if ([418].includes(err.status)){
        return this.handle418Error(req, next, err);
      } else if ([403].includes(err.status)){
        this.authService.logout()
        return next.handle(req)
      }
      const error = (err && err.error && err.error.message) || err.statusText;
      return throwError(() => new Error(error));
    }))
  }

  private handle418Error(
    req: HttpRequest<any>,
    next: HttpHandler,
    originalError: any
  ) {
    return this.authService.refreshToken().pipe(
      switchMap(() => {
        return next.handle(req);
      }),
      catchError(err => {
        // this.authService.logout();
        return throwError(() => new Error(originalError));
      })
    )
  }
}
