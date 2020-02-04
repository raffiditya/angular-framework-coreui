import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
})
export class LoginComponent implements OnInit {
  userLogin = {
    username: '',
    password: '',
    rememberMe: false,
  };
  wrongPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onLogin(loginForm: NgForm) {
    this.wrongPassword = false;
    if (!loginForm.form.valid) {
      return;
    }

    this.authService.login(this.userLogin.username, this.userLogin.password)
      .subscribe(
        _ => this.router.navigateByUrl('/dashboard'),
        (error: HttpErrorResponse) => {
          let errorResponse = error as HttpErrorResponse;
          if (errorResponse.status === 401 || errorResponse.status === 400) {
            this.wrongPassword = true;
          }
        }
      );
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.authService.logout();
    }
  }
}
