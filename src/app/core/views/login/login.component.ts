import {Component} from '@angular/core';
import {BlockUIService} from "ng-block-ui";
import {NgForm} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent {

  userLogin = {
    username: '',
    password: '',
    rememberMe: false
  };

  constructor(private loadingService: BlockUIService, private authService: AuthService, private router: Router,
              private toastr: ToastrService) { }

  onLogin(loginForm: NgForm) {
    console.log(this.userLogin);
    if (!loginForm.form.valid) {
      return;
    }

    this.loadingService.start('appRoot');

    this.authService.login(this.userLogin.username, this.userLogin.password).subscribe(
      () => {
        this.loadingService.stop('appRoot');
        this.router.navigateByUrl('/dashboard');
      },
      (error) => {
        let errorResponse = error as HttpErrorResponse;
        this.loadingService.stop('appRoot');
        this.toastr.error(`${errorResponse.message}`, 'Login Error');
      });

  }
}
