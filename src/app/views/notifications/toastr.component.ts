import { Component, OnInit } from '@angular/core';
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-toastr',
  templateUrl: './toastr.component.html',
  styles: []
})
export class ToastrComponent implements OnInit {

  constructor(private toastr: ToastrService) { }

  ngOnInit() {
  }

  showSuccess() {
    this.toastr.success('Hello Message.', 'Hello Title.');
  }

  showError() {
    this.toastr.error('Hello Message', 'Hello Title.');
  }

  showWarning() {
    this.toastr.warning('Hello Message', 'Hello Title.');
  }

  showInfo() {
    this.toastr.info('Hello Message', 'Hello Title.');
  }

  showPrimary() {
    this.toastr.show('Hello Message', 'Hello Title.', { toastClass: 'toast-primary toast' });
  }
}
