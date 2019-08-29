import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { constant } from '../../../environments/constant';
import { Page } from '../../core/model/page';

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(private http: HttpClient) {}

  getUsers(page?: Page): Observable<any> {
    if (!page) {
      page = {
        size: 10,
        pageNumber: 1,
      };
    }

    let request: string = `${constant.appUrl}/admin/user?page=${
      page.pageNumber
    }&size=${page.size}`;

    if (page.searchTerm) {
      request += `&username=${page.searchTerm}&url=${page.searchTerm}`;
    }

    if (page.sort) {
      request += `&sort=${page.sort}`;
    }

    return this.http.get(request);
  }

  getUser(id: number): Observable<any> {
    return this.http.get(`${constant.appUrl}/admin/user/${id}`);
  }

  addUser(user: any): Observable<any> {
    return this.http.post(`${constant.appUrl}/admin/user`, user);
  }

  editUser(id: number, user: any): Observable<any> {
    return this.http.put(`${constant.appUrl}/admin/user/${id}`, user);
  }

  deleteUser(id: any): Observable<any> {
    return this.http.delete(`${constant.appUrl}/admin/user/${id}`);
  }
}
