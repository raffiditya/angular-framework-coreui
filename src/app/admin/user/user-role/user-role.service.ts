import { Injectable } from '@angular/core';

import { constant } from '../../../../environments/constant';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../../../core/model/page';

@Injectable({ providedIn: 'root' })
export class AdminUserRoleService {
  constructor(private http: HttpClient) { }

  getAssignedRoles(id: number, page?: Page): Observable<any> {
    if (!page) {
      page = {
        size: 10,
        pageNumber: 1,
      };
    }

    let request: string = `${constant.appUrl}/admin/user-role?user.id=${id}&page=${page.pageNumber}&size=${page.size}`;

    if (page.searchTerm) {
      request += `&role.name=${page.searchTerm}`;
    }

    if (page.sort) {
      request += `&sort=${page.sort}`;
    }

    return this.http.get(request);
  }

  getAssignedRole(id: number): Observable<any> {
    return this.http.get(`${constant.appUrl}/admin/user-role/${id}`);
  }

  getRoles(page?: Page): Observable<any> {
    let request: string = `${constant.appUrl}/admin/role?size=3`;

    if (page.searchTerm) {
      request += `&name=${page.searchTerm}&url=${page.searchTerm}`;
    }

    return this.http.get(request);
  }

  getUser(id: number): Observable<any> {
    return this.http.get(`${constant.appUrl}/admin/user/${id}`);
  }

  addAssignedRole(assignedRole: any): Observable<any> {
    return this.http.post(`${constant.appUrl}/admin/user-role`, assignedRole);
  }

  editAssignedRole(id: number, assignedRole: any): Observable<any> {
    return this.http.put(`${constant.appUrl}/admin/user-role/${id}`, assignedRole);
  }

  deleteAssignedRole(id: any): Observable<any> {
    return this.http.delete(`${constant.appUrl}/admin/user-role/${id}`);
  }
}
