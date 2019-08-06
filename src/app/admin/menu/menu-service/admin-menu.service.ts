import { Injectable } from '@angular/core';

import { constant } from '../../../../environments/constant';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AdminMenuService {
  constructor(private http: HttpClient) {}

  getAllMenu(): Observable<any> {
    return this.http.get(`${constant.appUrl}/admin/menu`);
  }

  searchMenu(menu): Observable<any> {
    return this.http.get(`${constant.appUrl}/admin/menu?name=${menu}&&size=3`);
  }

  getMenu(id): Observable<any> {
    return this.http.get(`${constant.appUrl}/admin/menu/${id}`);
  }

  addMenu(menu): Observable<any> {
    return this.http.post(`${constant.appUrl}/admin/menu`, menu);
  }

  editMenu(id, menu): Observable<any> {
    return this.http.put(`${constant.appUrl}/admin/menu/${id}`, menu);
  }

  // deleteMenu(id): Observable<any> {
  //   return this.http.delete(`${constant.appUrl}/admin/menu/${id}`);
  // }
}
