import { Injectable } from '@angular/core';

import { constant } from '../../../environments/constant';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminOrganizationService {
  constructor(private http: HttpClient) {}

  getAllOrganization(): Observable<any> {
    return this.http.get(`${constant.appUrl}/admin/org`);
  }

  searchOrganization(organization): Observable<any> {
    return this.http.get(`${constant.appUrl}/admin/org?namex=${organization}`);
  }

  getOrganization(id): Observable<any> {
    return this.http.get(`${constant.appUrl}/admin/org/${id}`);
  }

  addOrganization(organization): Observable<any> {
    return this.http.post(`${constant.appUrl}/admin/org`, organization);
  }

  editOrganization(id, organization): Observable<any> {
    return this.http.put(`${constant.appUrl}/admin/org/${id}`, organization);
  }

  // deleteOrganization(id) {
  //   return this.http.delete(`${constant.appUrl}/admin/org/${id}`)
  // }
}
