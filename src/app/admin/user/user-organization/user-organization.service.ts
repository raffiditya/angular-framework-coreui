import { Injectable } from '@angular/core';

import { constant } from '../../../../environments/constant';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../../../core/model/page';

@Injectable({ providedIn: 'root' })
export class AdminUserOrganizationService {
  constructor(private http: HttpClient) { }

  getAssignedOrganizations(id: number, page?: Page): Observable<any> {
    if (!page) {
      page = {
        size: 10,
        pageNumber: 1,
      };
    }

    let request: string = `${constant.appUrl}/admin/user-org?user.id=${id}&page=${page.pageNumber}&size=${page.size}`;

    if (page.searchTerm) {
      request += `&organization.name=${page.searchTerm}`;
    }

    if (page.sort) {
      request += `&sort=${page.sort}`;
    }

    return this.http.get(request);
  }

  getAssignedOrganization(id: number): Observable<any> {
    return this.http.get(`${constant.appUrl}/admin/user-org/${id}`);
  }

  getOrganizations(page?: Page): Observable<any> {
    let request: string = `${constant.appUrl}/admin/organization?size=3`;

    if (page.searchTerm) {
      request += `&name=${page.searchTerm}&url=${page.searchTerm}`;
    }

    return this.http.get(request);
  }

  getUser(id: number): Observable<any> {
    return this.http.get(`${constant.appUrl}/admin/user/${id}`);
  }

  addAssignedOrganization(assignedOrganization: any): Observable<any> {
    return this.http.post(`${constant.appUrl}/admin/user-org`, assignedOrganization);
  }

  editAssignedOrganization(id: number, assignedOrganization: any): Observable<any> {
    return this.http.put(`${constant.appUrl}/admin/user-org/${id}`, assignedOrganization);
  }

  deleteAssignedOrganization(id: any): Observable<any> {
    return this.http.delete(`${constant.appUrl}/admin/user-org/${id}`);
  }
}
