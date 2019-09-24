import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { constant } from '../../../environments/constant';
import { Page } from '../../core/model/page.model';

@Injectable({ providedIn: 'root' })
export class PrivilegeService {

  constructor(private http: HttpClient) {}

  getPrivileges(page?: Page): Observable<any> {
    return this.http.get(`${constant.appUrl}/admin/privilege?name=${page.searchTerm}&size=3`);
  }
}
