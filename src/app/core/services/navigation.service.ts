import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {constant} from '../../../environments/constant';
import {map} from 'rxjs/operators';
import {NavData, navItems} from '../../_nav';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private http: HttpClient) {
  }

  public getMenu(): Observable<Array<NavData>> {
    return this.http.get<Array<NavData>>(`${constant.appUrl}/menu/tree`)
      .pipe(
        map(navigations => {
          return navigations.concat(navItems);
        })
      );
  }
}
