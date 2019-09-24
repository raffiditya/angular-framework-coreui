import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { constant } from '../../../environments/constant';
import { Page } from '../../core/model/page.model';

@Injectable({ providedIn: 'root' })
export class UserRoleService {

  constructor(private http: HttpClient) {}

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
