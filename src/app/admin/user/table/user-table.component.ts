import { Component, OnInit } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { finalize } from 'rxjs/operators';
import { PagedApiResponse, PageRequest } from '../../../lib/model';
import { sortTableFn } from '../../../util';
import { User } from '../../model';
import { UserService } from '../../service';

@Component({
  templateUrl: './user-table.component.html'
})
export class UserTableComponent implements OnInit {

  ColumnMode = ColumnMode;
  data: PagedApiResponse<User>;
  loadingIndicator: boolean;
  page: PageRequest = new PageRequest();
  sortTableFn: Function = sortTableFn;

  constructor(private userService: UserService) {}

  get offset(): number {
    return !!(this.data && this.data.number) ? this.data.number : 0;
  }

  get rows(): Array<User> {
    return !!(this.data && this.data.content) ? this.data.content : [];
  }

  get totalElements(): number {
    return !!(this.data && this.data.totalElements) ? this.data.totalElements : 0;
  }

  ngOnInit() {
    this.getUsers();
  }

  getUsers(pageNumber: number = 1) {
    this.loadingIndicator = true;
    this.page.page = pageNumber;

    this.userService
      .getTableRows(this.page)
      .pipe(
        finalize(() => this.loadingIndicator = false)
      )
      .subscribe(data => this.data = data);
  }

  inactivateUser(userId: number) {
    this.userService
      .delete(userId)
      .subscribe(() => this.getUsers());
  }
}
