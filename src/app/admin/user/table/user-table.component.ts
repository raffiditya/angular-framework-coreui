import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { finalize } from "rxjs/operators";
import { Page } from '../../../core/model/page';
import { sortTable } from '../../../util';
import { UserService } from '../../service/user.service';

@Component({
  templateUrl: './user-table.component.html'
})
export class UserTableComponent implements OnInit {

  ColumnMode = ColumnMode;
  loadingIndicator: boolean;
  page: Page = new Page();
  rows: any[] = [];
  sortTable: Function = sortTable;

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers(pageNumber?: number) {
    this.loadingIndicator = true;

    if (pageNumber) {
      this.page.pageNumber = pageNumber;
    }

    this.userService.getUsers(this.page)
      .pipe(
        finalize(() => this.loadingIndicator = false)
      )
      .subscribe(data => {
        this.page.totalElements = data.totalElements;
        this.page.totalPages = data.totalPages;
        this.rows = data['content'];
      });
  }

  inactivateUser(userId: number) {
    this.userService.deleteUser(userId)
      .subscribe(data => {
        this.toastr.success(data.message, 'Delete User');
        this.getUsers();
      });
  }
}
