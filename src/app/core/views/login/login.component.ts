import { Component } from '@angular/core';
import { BlockUIService } from 'ng-block-ui';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
})
export class LoginComponent {
  wrongPassword: boolean = false;

  userLogin = {
    username: '',
    password: '',
    rememberMe: false,
  };

  constructor(
    // private loadingService: BlockUIService,
    private authService: AuthService,
    private router: Router,
  ) { }

  onLogin(loginForm: NgForm) {
    this.wrongPassword = false;
    if (!loginForm.form.valid) {
      return;
    }

    // this.loadingService.start('appRoot');

    this.authService
      .login(this.userLogin.username, this.userLogin.password)
      .subscribe(
        _ =>
          this.router
            .navigateByUrl('/dashboard'),
        (error: HttpErrorResponse) => {
          let errorResponse = error as HttpErrorResponse;
          if (errorResponse.status === 401) {
            this.wrongPassword = true;
          }
          // this.loadingService.reset('appRoot');
        }
      );
  }
}
