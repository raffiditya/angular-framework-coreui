import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { constant } from '../../../environments/constant';
import { NavData } from '../../_nav';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private http: HttpClient) {}

  public getMenu(): Observable<Array<NavData>> {
    return this.http.get<Array<NavData>>(`${constant.appUrl}/menu/tree`);
  }
}
