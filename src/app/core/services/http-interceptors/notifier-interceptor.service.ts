import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotifierInterceptorService implements HttpInterceptor {

  constructor(private toasterService: ToastrService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        tap(
          event => {
            if (event instanceof HttpResponse) {
              if (event.status === 200 && event.body.message) {
                this.toasterService.success(`${event.body.message}`, 'Success');
              }
            }
          },
          err => {
            if (err instanceof HttpErrorResponse) {
              if (err.status !== 403 && err.url !== AuthService.loginUrl) {
                this.toasterService.error(`${err.error.message}`, 'Error');
              }
            }
          }
        )
      );
  }
}
