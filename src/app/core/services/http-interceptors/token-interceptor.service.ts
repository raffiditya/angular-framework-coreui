import {
  HttpErrorResponse,
  HttpHandler,
  HttpHeaderResponse,
  HttpInterceptor,
  HttpProgressEvent,
  HttpRequest,
  HttpResponse,
  HttpSentEvent,
  HttpUserEvent
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, EMPTY, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, switchMapTo, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(
    private auth: AuthService,
    private toasterService: ToastrService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent
    | HttpResponse<any> | HttpUserEvent<any> | any> {

    if (req.url === AuthService.loginUrl) {
      return next.handle(req);
    }

    if (!this.auth.isAuthenticated()) {
      this.toasterService.error('Please log in.', 'Session Timed Out');
      this.router.navigateByUrl('/login').then();
      return EMPTY;
    }

    return next.handle(this.addToken(req))
      .pipe(
        catchError(err => {
          if (err instanceof HttpErrorResponse) {
            return err.status === 401 && err.url !== AuthService.loginUrl
                   ? this.doRefreshToken(req, next)
                   : EMPTY;
          }

          return throwError(err);
        }),
      );
  }

  private addToken(request: HttpRequest<any>): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.auth.accessToken}`
      }
    });
  }

  private doRefreshToken(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse
    | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any> | any> {
    if (this.isRefreshing) {
      return this.refreshTokenSubject
        .pipe(
          filter(token => token != null),
          take(1),
          tap(() => this.isRefreshing = false),
          switchMapTo(next.handle(this.addToken(req)))
        );
    }

    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    return this.auth.doRefreshToken()
      .pipe(
        tap(() => this.isRefreshing = false),
        switchMap(response => {
          this.refreshTokenSubject.next(response.access_token);
          return next.handle(this.addToken(req));
        }),
        catchError(() => {
          this.isRefreshing = false;
          this.refreshTokenSubject.unsubscribe();
          this.auth.clearCredentials();
          this.toasterService.error('Please log in.', 'Session Timed Out');
          this.router.navigateByUrl('/login').then();
          return EMPTY;
        })
      );
  }
}
