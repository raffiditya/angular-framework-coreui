import { Injectable } from '@angular/core';

import { constant } from '../../../environments/constant';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../../core/model/page';

@Injectable({ providedIn: 'root' })
export class AdminRoleService {
  constructor(private http: HttpClient) { }

  getRoles(page?: Page): Observable<any> {
    if (!page) {
      page = {
        size: 10,
        pageNumber: 1
      }
    }

    let request: string = `${constant.appUrl}/admin/role?page=${page.pageNumber}&size=${page.size}`

    if (page.searchTerm) {
      request += `&name=${page.searchTerm}&url=${page.searchTerm}`
    }

    if (page.sort) {
      request += `&sort=${page.sort}`
    }

    return this.http.get(request)
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

  deleteRole(id: string): Observable<any> {
    return this.http.delete(`${constant.appUrl}/admin/role/${id}`);
  }

  // searchRole(keyword: any): Observable<any> {
  //   return this.http.get(
  //     `${constant.appUrl}/admin/role?name=${keyword}&url=${keyword}`,
  //   );
  // }

  // sortRole(keyword: any, page: any, sort: any, type: any): Observable<any> {
  //   return this.http.get(
  //     `${
  //     constant.appUrl
  //     }/admin/role?name=${keyword}&url=${keyword}&page=${page}&sort=${sort},${type}`,
  //   );
  // }
}
