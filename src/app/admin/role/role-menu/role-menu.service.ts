import { Injectable } from '@angular/core';

import { constant } from '../../../../environments/constant';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../../../core/model/page';

@Injectable({ providedIn: 'root' })
export class AdminRoleMenuService {
  constructor(private http: HttpClient) { }

  getAssignedMenus(page?: Page): Observable<any> {
    if (!page) {
      page = {
        size: 10,
        pageNumber: 1,
      };
    }

    let request: string = `${constant.appUrl}/admin/role-menu?role.id=${page.roleId}&page=${page.pageNumber}&size=${page.size}`;

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

  getMenus(page?: Page): Observable<any> {
    let request: string = `${constant.appUrl}/admin/menu?page=${page.pageNumber}&size=${page.size}`;

    if (page.searchTerm) {
      request += `&name=${page.searchTerm}&url=${page.searchTerm}`;
    }

    return this.http.get(request);
  }

  getRole(id: number): Observable<any> {
    return this.http.get(`${constant.appUrl}/admin/role/${id}`);
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
