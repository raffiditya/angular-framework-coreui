import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { constant } from '../../../environments/constant';
import { Page } from '../../core/model/page.model';

@Injectable({ providedIn: 'root' })
export class OrganizationService {

  constructor(private http: HttpClient) {}

  getOrganizations(page?: Page): Observable<any> {
    if (!page) {
      page = {
        size: 10,
        pageNumber: 1,
      };
    }

    let request: string = `${constant.appUrl}/admin/organization?page=${page.pageNumber}&size=${page.size}`;

    if (page.searchTerm) {
      request += `&name=${page.searchTerm}&abbreviation=${page.searchTerm}`;
    }

    if (page.sort) {
      request += `&sort=${page.sort}`;
    }

    return this.http.get(request);
  }

  getOrganization(id: number): Observable<any> {
    return this.http.get(`${constant.appUrl}/admin/organization/${id}`);
  }

  addOrganization(organization: any): Observable<any> {
    return this.http.post(`${constant.appUrl}/admin/organization`, organization);
  }

  editOrganization(id: number, organization: any): Observable<any> {
    return this.http.put(`${constant.appUrl}/admin/organization/${id}`, organization);
  }

  deleteOrganization(id: number): Observable<any> {
    return this.http.delete(`${constant.appUrl}/admin/organization/${id}`)
  }
}
