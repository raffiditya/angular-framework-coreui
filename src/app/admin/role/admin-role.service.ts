import { Injectable } from '@angular/core';

import { constant } from '../../../environments/constant';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminRoleService {
  constructor(private http: HttpClient) {}

  getAllRoles(page, size): Observable<any> {
    return this.http.get(
      `${constant.appUrl}/admin/role?page=${page + 1}&size=${size}`,
    );
  }

  getRole(id): Observable<any> {
    return this.http.get(`${constant.appUrl}/admin/role/${id}`);
  }

  addRole(menu): Observable<any> {
    return this.http.post(`${constant.appUrl}/admin/role`, menu);
  }

  editRole(id, menu): Observable<any> {
    return this.http.put(`${constant.appUrl}/admin/role/${id}`, menu);
  }

  deleteRole(id): Observable<any> {
    return this.http.delete(`${constant.appUrl}/admin/role/${id}`);
  }
}
