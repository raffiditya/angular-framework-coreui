import { Component } from '@angular/core';
import { BlockUIService } from "ng-block-ui";
import { Router } from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent {

  constructor(
    private loadingService: BlockUIService,
    private router: Router) {
  }

  onLogin() {
    this.loadingService.start('appRoot');

    setTimeout(() => {
      this.loadingService.stop('appRoot'); // Stop blocking
      this.router.navigate(['/dashboard']);
    }, 3000);
  }

}
