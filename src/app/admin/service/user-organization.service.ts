import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { constant } from '../../../environments/constant';
import { Page } from '../../core/model/page.model';

@Injectable({ providedIn: 'root' })
export class UserOrganizationService {

  constructor(private http: HttpClient) {}

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
