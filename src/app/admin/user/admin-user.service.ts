import { Injectable } from '@angular/core';

import { constant } from '../../../environments/constant';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminUsersService {
  constructor(private http: HttpClient) {}

  getAllUser(page: number, size: number): Observable<any> {
    return this.http.get(
      `${constant.appUrl}/admin/user?page=${page + 1}&size=${size})`,
    );
  }

  // searchMenu(menu): Observable<any> {
  //   return this.http.get(`http://localhost:3000/content?q=${menu}`)
  // }

  getUser(id: number): Observable<any> {
    return this.http.get(`${constant.appUrl}/admin/user/${id}`);
  }

  // addUser(user): Observable<any> {
  //   return this.http.post(`http://localhost:3000/users`, user)
  // }

  // editUser(id, user) {
  //   return this.http.put(`http://localhost:3000/users/${id}`, user)
  // }

  deleteUser(id: any) {
    return this.http.delete(`${constant.appUrl}/admin/user/${id}`);
  }

  searchUser(keyword: any): Observable<any> {
    return this.http.get(
      `${constant.appUrl}/admin/user?username=${keyword}&url=${keyword}`,
    );
  }

  sortUser(keyword: any, page: any, sort: any, type: any): Observable<any> {
    return this.http.get(
      `${
        constant.appUrl
      }/admin/user?username=${keyword}&url=${keyword}&page=${page}&sort=${sort},${type}`,
    );
  }
}
