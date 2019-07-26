import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {delay, tap} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    return Boolean(token);
  }

  public loginMock(username: string, password: string): Observable<any> {
    return of({success: true}).pipe(
      delay(1500),
      tap(() => localStorage.setItem('accessToken', username + password))
    );
  }

  public login(username: string, password: string): Observable<any> {
    let body = `grant_type=password&username=${username}&password=${password}`;
    return this.http.post(
      `${environment.apiUrl}/oauth/token`,
      body,
      {
        headers: new HttpHeaders({
            'Authorization': 'Basic ' + btoa(`${environment.basicUsername}:${environment.basicPassword}`),
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        )
      })
      .pipe(
        tap(response => {
          localStorage.setItem('accessToken', response.access_token)
        })
      );
  }

  public logoutMock(): Observable<any> {
    return of({success: true}).pipe(
      delay(1000),
      tap(() => localStorage.clear())
    );
  }

  public logout(): Observable<any> {
    return this.http.post(`${environment.apiUrl}/oauth/logout/token`,
      null,
      {
        headers: new HttpHeaders({
            'Authorization': 'Bearer ' + btoa(localStorage.getItem('accessToken'))
          }
        )
      })
      .pipe(
        tap(response => {
          localStorage.clear()
        })
      );
  }
}
