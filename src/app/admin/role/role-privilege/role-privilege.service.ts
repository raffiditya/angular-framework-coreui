import { Injectable } from '@angular/core';
import { constant } from '../../../../environments/constant';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../../../core/model/page';

@Injectable({ providedIn: 'root' })
export class AdminRolePrivilegeService {
  constructor(private http: HttpClient) { }

  getAssignedPrivilege(page?: Page): Observable<any> {
    if (!page) {
      page = {
        size: 10,
        pageNumber: 1,
      };
    }

    let request: string = `${constant.appUrl}/admin/role-prev?role.id=${page.roleId}&page=${page.pageNumber}&size=${page.size}`;

    if (page.searchTerm) {
      request += `&privilege.name=${page.searchTerm}`;
    }

    if (page.sort) {
      request += `&sort=${page.sort}`;
    }

    return this.http.get(request);
  }

  getPrivileges(page?: Page): Observable<any> {
    return this.http.get(`${constant.appUrl}/admin/role-prev/prev?name=${page.searchTerm}`);
  }

  getRole(id: number): Observable<any> {
    return this.http.get(`${constant.appUrl}/admin/role/${id}`);
  }

  getPrivilege(id: number): Observable<any> {
    return this.http.get(`${constant.appUrl}/admin/role-prev/${id}`);
  }

  addAssignedPrivilege(assignedPrivilege: any): Observable<any> {
    return this.http.post(`${constant.appUrl}/admin/role-prev`, assignedPrivilege);
  }

  editAssignedPrivilege(id: number, assignedPrivilege: any): Observable<any> {
    return this.http.put(`${constant.appUrl}/admin/role-prev/${id}`, assignedPrivilege);
  }
}
