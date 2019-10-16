import { Component } from '@angular/core';
import { UserService } from '../core/services';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent {

  constructor(private userService: UserService) {}

  get organizations() {
    return this.userService.organizationNameList;
  }

  get roles() {
    return this.userService.roleList;
  }

  get username() {
    return this.userService.username;
  }
}
