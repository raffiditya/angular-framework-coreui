import { Component } from '@angular/core';
import { BlockUIService } from "ng-block-ui";
import { Router } from "@angular/router";
import { FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent {

  submitted = false;

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    rememberMe: [false]
  });

  constructor(
    private loadingService: BlockUIService,
    private router: Router,
    private fb: FormBuilder) {
  }

  isFieldInvalid(field: string) {
    const fieldControl = this.loginForm.get(field);
    return fieldControl.invalid && (this.submitted || fieldControl.dirty || fieldControl.touched);
  }

  onLogin() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    this.loadingService.start('appRoot');

    setTimeout(() => {
      this.loadingService.stop('appRoot'); // Stop blocking
      this.router.navigateByUrl('/dashboard');
    }, 3000);
  }

}
