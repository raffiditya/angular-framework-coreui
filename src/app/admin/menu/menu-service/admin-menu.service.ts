import { Injectable } from '@angular/core'
import { constant } from '../../../../environments/constant';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Content } from '@angular/compiler/src/render3/r3_ast';

@Injectable({ providedIn: 'root' })
export class AdminMenuService {
  constructor(
    private http: HttpClient) {
  }

  getAllMenu(): Observable<Object> {
    return this.http.get(`${constant.appUrl}/admin/menu`);
  };

  searchMenu(menu): Observable<any> {
    return this.http.get(`http://localhost:3000/content?q=${menu}`)
  }

  getMenu(id): Observable<any> {
    return this.http.get(`http://localhost:3000/content/${id}`)
  }

  addMenu(menu): Observable<any> {
    return this.http.post(`http://localhost:3000/content`, menu)
  }

  editMenu(id, menu) {
    return this.http.put(`http://localhost:3000/content/${id}`, menu)
  }

  deleteMenu(id) {
    return this.http.delete(`http://localhost:3000/content/${id}`)
  }
}
