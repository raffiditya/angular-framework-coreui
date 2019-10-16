import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { constant } from '../../../environments/constant';
import { Organization } from '../../lib/model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  static readonly profileUrl = `${constant.oauthUrl}/profile/me`;

  constructor(private http: HttpClient) {}

  public get organizationList(): Organization[] {
    return JSON.parse(localStorage.getItem('organizationList'));
  }

  public set organizationList(organizationList: Organization[]) {
    localStorage.setItem('organizationList', JSON.stringify(organizationList));
  }

  public get organizationNameList(): string {
    const organizations: Organization[] = JSON.parse(localStorage.getItem('organizationList'));
    let organizationNames: string[] = [];
    organizations.forEach(organization => organizationNames.push(organization.name));

    return organizationNames.join(', ');
  }

  public get roleList() {
    return localStorage.getItem('roleList');
  }

  public set roleList(roleList: string) {
    localStorage.setItem('roleList', roleList);
  }

  public get username() {
    return localStorage.getItem('username');
  }

  public set username(username: string) {
    localStorage.setItem('username', username);
  }

  public getProfile(): Observable<any> {
    return this.http.get(UserService.profileUrl)
      .pipe(
        tap((profile: any) => {
          const principal = profile.principal;
          const authorities: Object[] = principal.authorities;
          let roleList: string[] = [];
          authorities.forEach((value: any) => {
            const authority: string = value.authority;
            if (authority.startsWith('ROLE_')) {
              roleList.push(authority.slice(5, authority.length));
            }
          });
          this.roleList = roleList.join(', ');
          this.organizationList = principal.organizationList;
        })
      );
  }
}
