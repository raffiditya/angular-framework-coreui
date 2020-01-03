import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { INavData } from '@coreui/angular';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { constant } from '../../../environments/constant';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private http: HttpClient) {}

  public getMenu(moduleId: number): Observable<Array<INavData>> {
    let menuList: Array<INavData> = this.getMenuCache(moduleId);
    if (menuList === null) {
      return this.fetchMenuModule(moduleId)
        .pipe(
          tap((menuList: Array<INavData>) => {
            this.setMenuCache(moduleId, menuList);
          })
        );
    }

    return of(menuList);
  }

  private fetchMenuModule(moduleId: number): Observable<Array<INavData>> {
    return this.http.get<Array<INavData>>(`${constant.appUrl}/menu/tree/${moduleId}`);
  }

  private getMenuCache(moduleId: number): Array<INavData> {
    return JSON.parse(localStorage.getItem(`menuModule${moduleId}`));
  }

  private setMenuCache(moduleId: number, menuList: Array<INavData>) {
    localStorage.setItem(`menuModule${moduleId}`, JSON.stringify(menuList));
  }
}
