import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { constant } from '../../../environments/constant';
import { Page } from '../../core/model/page.model';

@Injectable({ providedIn: 'root' })
export class RolePrivilegeService {

  constructor(private http: HttpClient) {}

  getAssignedPrivileges(id: number, page?: Page): Observable<any> {
    if (!page) {
      page = {
        size: 10,
        pageNumber: 1,
      };
    }

    let request: string = `${constant.appUrl}/admin/role-privilege?role.id=${id}&page=${page.pageNumber}&size=${page.size}`;

    if (page.searchTerm) {
      request += `&privilege.name=${page.searchTerm}`;
    }

    if (page.sort) {
      request += `&sort=${page.sort}`;
    }

    return this.http.get(request);
  }

  getAssignedPrivilege(id: number): Observable<any> {
    return this.http.get(`${constant.appUrl}/admin/role-privilege/${id}`);
  }

  addAssignedPrivilege(assignedPrivilege: any): Observable<any> {
    return this.http.post(`${constant.appUrl}/admin/role-privilege`, assignedPrivilege);
  }

  editAssignedPrivilege(id: number, assignedPrivilege: any): Observable<any> {
    return this.http.put(`${constant.appUrl}/admin/role-privilege/${id}`, assignedPrivilege);
  }
}
