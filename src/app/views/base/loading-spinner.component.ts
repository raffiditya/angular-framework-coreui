import { Component, OnInit } from '@angular/core';
import { BlockUIService } from "ng-block-ui";

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styles: []
})
export class LoadingSpinnerComponent implements OnInit {

  constructor(private blockUiService: BlockUIService) {
  }

  ngOnInit() {
  }

  blockRoot() {
    this.blockUiService.start('appRoot');

    setTimeout(() => {
      this.blockUiService.stop('appRoot'); // Stop blocking
    }, 5000);
  }

  blockComponent() {
    this.blockUiService.start('component');

    setTimeout(() => {
      this.blockUiService.stop('component'); // Stop blocking
    }, 5000);
  }

  blockElement() {
    this.blockUiService.start('element');

    setTimeout(() => {
      this.blockUiService.stop('element'); // Stop blocking
    }, 5000);
  }
}
