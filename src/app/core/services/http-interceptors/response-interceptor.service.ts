import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse, PagedApiResponse } from '../../../lib/model';

@Injectable({
  providedIn: 'root'
})
export class ResponseInterceptorService implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        map(
          event => {
            if (event instanceof HttpResponse) {
              const response: HttpResponse<any> = event as HttpResponse<any>;
              if ((response.body as PagedApiResponse<any>).pageable) {
                return response;
              }

              if ((response.body as ApiResponse<any>).content) {
                return response.clone({
                  body: (response.body as ApiResponse<any>).content
                });
              }
            }

            return event;
          }
        )
      );
  }
}
