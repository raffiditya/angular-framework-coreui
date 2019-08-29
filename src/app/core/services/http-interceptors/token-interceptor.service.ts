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
import { BlockUIService } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, EMPTY, Observable, throwError } from 'rxjs';
import { catchError, filter, finalize, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(
    private auth: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private blockUiService: BlockUIService,) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent
    | HttpResponse<any> | HttpUserEvent<any> | any> {
    this.blockUiService.start('appRoot');

    if (req.url === AuthService.loginUrl) {
      return next.handle(req);
    } else if (!this.auth.isAuthenticated()) {
      this.toastr.error('Please log in.', 'Session Timed Out');
      this.router.navigateByUrl('/login').then();
      this.blockUiService.reset('appRoot');
      return;
    }

    return next.handle(this.addToken(req))
      .pipe(
        catchError(err => {
          if (err instanceof HttpErrorResponse) {
            const errorResponse = <HttpErrorResponse>err;
            if (errorResponse.status === 401 && errorResponse.url !== AuthService.loginUrl) {
              return this.doRefreshToken(req, next);
            } else {
              this.toastr.error(`${err.error.message}`, 'Error HTTP Request');
              return EMPTY;
            }
          } else {
            return throwError(err);
          }
        }),
        finalize(() => this.blockUiService.reset('appRoot'))
      );
  }

  private addToken(request: HttpRequest<any>): HttpRequest<any> {
    return request.clone({ setHeaders: { Authorization: `Bearer ${this.auth.accessToken}` } });
  }

  private doRefreshToken(req: HttpRequest<any>, next: HttpHandler) {
    if (this.isRefreshing) {
      return this.refreshTokenSubject
        .pipe(
          filter(token => token != null),
          take(1),
          tap(
            () => {
              return next.handle(this.addToken(req));
            }
          ));
    } else {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.auth.doRefreshToken()
        .pipe(
          switchMap(response => {
            this.refreshTokenSubject.next(response.access_token);
            return next.handle(this.addToken(req));
          }),
          catchError(() => {
            this.auth.clearCredentials();
            this.toastr.error('Please log in.', 'Session Timed Out');
            this.router.navigateByUrl('/login').then();
            return EMPTY;
          }),
          finalize(() => {
            this.isRefreshing = false;
            this.blockUiService.reset('appRoot');
          })
        );
    }
  }
}
