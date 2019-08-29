import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { constant } from '../../../environments/constant';
import { Page } from '../../core/model/page';

@Injectable({ providedIn: 'root' })
export class RoleMenuService {

  constructor(private http: HttpClient) {}

  getAssignedMenus(id: number, page?: Page): Observable<any> {
    if (!page) {
      page = {
        size: 10,
        pageNumber: 1,
      };
    }

    let request: string = `${constant.appUrl}/admin/role-menu?role.id=${id}&page=${page.pageNumber}&size=${page.size}`;

    if (page.searchTerm) {
      request += `&menu.name=${page.searchTerm}`;
    }

    if (page.sort) {
      request += `&sort=${page.sort}`;
    }

    return this.http.get(request);
  }

  getAssignedMenu(id: number): Observable<any> {
    return this.http.get(`${constant.appUrl}/admin/role-menu/${id}`);
  }

  addAssignedMenu(assignedMenu: any): Observable<any> {
    return this.http.post(`${constant.appUrl}/admin/role-menu`, assignedMenu);
  }

  editAssignedMenu(id: number, assignedMenu: any): Observable<any> {
    return this.http.put(`${constant.appUrl}/admin/role-menu/${id}`, assignedMenu);
  }

  deleteAssignedMenu(id: any): Observable<any> {
    return this.http.delete(`${constant.appUrl}/admin/role-menu/${id}`);
  }
}
