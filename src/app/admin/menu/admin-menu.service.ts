import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { constant } from '../../../environments/constant';

@Injectable({ providedIn: 'root' })
export class AdminMenuService {
  constructor(private http: HttpClient) {}

  getAllMenu(page: number, size: number): Observable<any> {
    return this.http.get(
      `${constant.appUrl}/admin/menu?page=${page + 1}&size=${size}`,
    );
  }

  selectMenu(menu: string): Observable<any> {
    return this.http.get(`${constant.appUrl}/admin/menu?name=${menu}&&size=3`);
  }

  getMenu(id: number): Observable<any> {
    return this.http.get(`${constant.appUrl}/admin/menu/${id}`);
  }

  addMenu(menu: any): Observable<any> {
    return this.http.post(`${constant.appUrl}/admin/menu`, menu);
  }

  editMenu(id: number, menu: any): Observable<any> {
    return this.http.put(`${constant.appUrl}/admin/menu/${id}`, menu);
  }

  deleteMenu(id: any): Observable<any> {
    return this.http.delete(`${constant.appUrl}/admin/menu/${id}`);
  }

  searchMenu(keyword: any): Observable<any> {
    return this.http.get(
      `${constant.appUrl}/admin/menu?name=${keyword}&url=${keyword}`,
    );
  }

  sortMenu(keyword: any, page: any, sort: any, type: any): Observable<any> {
    return this.http.get(
      `${
        constant.appUrl
      }/admin/menu?name=${keyword}&url=${keyword}&page=${page}&sort=${sort},${type}`,
    );
  }
}
