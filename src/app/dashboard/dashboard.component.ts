import { Component } from '@angular/core';
import { AuthService } from '../core/services/auth.service';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent {

  constructor(private authService: AuthService) {
    console.log(this.authService.organizationList);
  }

  get organizations() {
    return this.authService.organizationNameList;
  }

  get roles() {
    return this.authService.roleList;
  }

  get username() {
    return this.authService.username;
  }

}
