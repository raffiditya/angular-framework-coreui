import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { constant } from '../../../environments/constant';
import { Page } from '../../core/model/page';

@Injectable({ providedIn: 'root' })
export class RoleService {

  constructor(private http: HttpClient) {}

  getRoles(page?: Page): Observable<any> {
    if (!page) {
      page = {
        size: 10,
        pageNumber: 1
      };
    }

    let request: string = `${constant.appUrl}/admin/role?page=${page.pageNumber}&size=${page.size}`;

    if (page.searchTerm) {
      request += `&name=${page.searchTerm}&url=${page.searchTerm}`;
    }

    if (page.sort) {
      request += `&sort=${page.sort}`;
    }

    return this.http.get(request);
  }

  getRole(id: number): Observable<any> {
    return this.http.get(`${constant.appUrl}/admin/role/${id}`);
  }

  addRole(menu: any): Observable<any> {
    return this.http.post(`${constant.appUrl}/admin/role`, menu);
  }

  editRole(id: number, menu: any): Observable<any> {
    return this.http.put(`${constant.appUrl}/admin/role/${id}`, menu);
  }

  deleteRole(id: number): Observable<any> {
    return this.http.delete(`${constant.appUrl}/admin/role/${id}`);
  }
}
