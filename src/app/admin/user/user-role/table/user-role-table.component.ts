import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { finalize } from 'rxjs/operators';
import { PagedApiResponse, PageRequest } from '../../../../lib/model';
import { sortTableFn } from '../../../../util';
import { UserRole } from '../../../model';
import { UserRoleService } from '../../../service';

@Component({
  selector: 'user-role-table',
  templateUrl: './user-role-table.component.html'
})
export class UserRoleTableComponent implements OnInit {

  ColumnMode = ColumnMode;
  data: PagedApiResponse<UserRole>;
  @Input() editable: boolean;
  loadingIndicator: boolean;
  page: PageRequest = new PageRequest();
  sortTableFn: Function = sortTableFn;
  userId: number;

  constructor(
    private userRoleService: UserRoleService,
    private activatedRoute: ActivatedRoute
  ) {}

  get offset(): number {
    return !!(this.data && this.data.number) ? this.data.number : 0;
  }

  get rows(): Array<UserRole> {
    return !!(this.data && this.data.content) ? this.data.content : [];
  }

  get totalElements(): number {
    return !!(this.data && this.data.totalElements) ? this.data.totalElements : 0;
  }

  ngOnInit() {
    this.userId = Number(this.activatedRoute.snapshot.paramMap.get('userId'));
    this.getUserRole();
  }

  getUserRole(pageNumber?: number) {
    this.loadingIndicator = true;
    this.page.page = pageNumber;

    this.userRoleService
      .getRowsFromRelation(this.page, this.userId)
      .pipe(
        finalize(() => this.loadingIndicator = false)
      )
      .subscribe(data => this.data = data);
  }

  inactivateUserRole(userRoleId: number) {
    this.userRoleService
      .delete(userRoleId)
      .subscribe(() => this.getUserRole());
  }
}
