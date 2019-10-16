import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { constant } from '../../../environments/constant';
import { environment } from '../../../environments/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  static readonly loginUrl = `${constant.oauthUrl}/token`;
  static readonly logoutUrl = `${constant.oauthUrl}/token/logout`;

  constructor(private http: HttpClient, private userService: UserService) {}

  public get accessToken(): string {
    return localStorage.getItem('accessToken');
  }

  public set accessToken(accessToken: string) {
    localStorage.setItem('accessToken', accessToken);
  }

  public get refreshToken(): string {
    return localStorage.getItem('refreshToken');
  }

  public set refreshToken(refreshToken: string) {
    localStorage.setItem('refreshToken', refreshToken);
  }

  // noinspection JSMethodCanBeStatic
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
          this.userService.username = username;

          return this.userService.getProfile();
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
