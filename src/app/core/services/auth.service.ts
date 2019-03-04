import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { delay, tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return Boolean(token);
  }

  public login(username: string, password: string): Observable<any> {
    return of({success: true}).pipe(
      delay(1500),
      tap(() => localStorage.setItem('token', username + password))
    );
  }

  public logout(): Observable<any> {
    return of({success: true}).pipe(
      delay(1000),
      tap(() => localStorage.clear())
    );
  }
}
