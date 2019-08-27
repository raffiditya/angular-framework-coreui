import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { constant } from '../../../environments/constant';
import { Page } from '../../core/model/page';

@Injectable({ providedIn: 'root' })
export class AdminMenuService {
  constructor(private http: HttpClient) { }

  getMenus(page?: Page): Observable<any> {
    if (!page) {
      page = {
        size: 10,
        pageNumber: 1,
      };
    }

    let request: string = `${constant.appUrl}/admin/menu?page=${
      page.pageNumber
      }&size=${page.size}`;

    if (page.searchTerm) {
      request += `&name=${page.searchTerm}&url=${page.searchTerm}&size=3`;
    }

    if (page.sort) {
      request += `&sort=${page.sort}`;
    }

    return this.http.get(request);
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
}
