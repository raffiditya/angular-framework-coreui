import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { constant } from '../../../../environments/constant';

@Injectable({ providedIn: 'root' })
export class AdminMenuService {
  constructor(private http: HttpClient) {}

  getAllMenu(page, size): Observable<any> {
    return this.http.get(
      `${constant.appUrl}/admin/menu?page=${page + 1}&size=${size}`,
    );
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

  deleteMenu(id): Observable<any> {
    return this.http.delete(`${constant.appUrl}/admin/menu/${id}`);
  }
}
