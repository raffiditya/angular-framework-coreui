import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { constant } from '../../../environments/constant';
import { environment } from '../../../environments/environment';
import { Organization } from '../model/organization.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  static readonly loginUrl = `${constant.oauthUrl}/token`;
  static readonly logoutUrl = `${constant.oauthUrl}/token/logout`;
  static readonly profileUrl = `${constant.oauthUrl}/profile/me`;

  constructor(private http: HttpClient) {
  }

  public get accessToken(): string {
    return localStorage.getItem('accessToken');
  }

  public set accessToken(accessToken: string) {
    localStorage.setItem('accessToken', accessToken);
  }

  public get organizationList(): Organization[] {
    return JSON.parse(localStorage.getItem('organizationList'));
  }

  public set organizationList(organizationList: Organization[]) {
    localStorage.setItem('organizationList', JSON.stringify(organizationList));
  }

  public get organizationNameList(): string {
    const organizations: Organization[] = JSON.parse(localStorage.getItem('organizationList'));
    let organizationNames: string[] = [];
    organizations.forEach(organization => {
      organizationNames.push(organization.name);
    });

    return organizationNames.join(', ');
  }

  public get refreshToken(): string {
    return localStorage.getItem('refreshToken');
  }

  public set refreshToken(refreshToken: string) {
    localStorage.setItem('refreshToken', refreshToken);
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

  private get basicHeader(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Basic ' + btoa(`${environment.basicUsername}:${environment.basicPassword}`),
      'Content-Type': 'application/x-www-form-urlencoded'
    });
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    return Boolean(token);
  }

  public clearCredentials() {
    localStorage.clear();
  }

  public doRefreshToken(): Observable<any> {
    const body = `grant_type=refresh_token&refresh_token=${this.refreshToken}`;

    return this.http.post(
      AuthService.loginUrl,
      body,
      {
        headers: this.basicHeader
      })
      .pipe(
        tap(response => this.accessToken = response.access_token)
      );
  }

  public login(username: string, password: string): Observable<any> {
    const body = `grant_type=password&username=${username}&password=${password}`;
    return this.http.post(
      AuthService.loginUrl,
      body,
      {
        headers: this.basicHeader
      })
      .pipe(
        switchMap((response: any) => {
          this.accessToken = response.access_token;
          this.refreshToken = response.refresh_token;
          this.username = username;

          return this.http.get(AuthService.profileUrl)
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
        }),
      );
  }

  public logout(): Observable<any> {
    return this.http.post(
      AuthService.logoutUrl,
      null
    )
      .pipe(
        finalize(() => this.clearCredentials())
      );
  }
}
