import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { finalize, map } from "rxjs/operators";
import { Page } from '../../../../core/model/page';
import { sortTable } from '../../../../util';
import { UserRoleService } from '../../../service/user-role.service';

@Component({
  selector: 'user-role-table',
  templateUrl: './user-role-table.component.html'
})
export class UserRoleTableComponent implements OnInit {

  ColumnMode = ColumnMode;
  @Input() editable: boolean;
  loadingIndicator: boolean;
  page: Page = new Page();
  rows: any[] = [];
  sortTable: Function = sortTable;
  userId: number;

  constructor(
    private userRoleService: UserRoleService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.userId = Number(this.activatedRoute.snapshot.paramMap.get('userId'));
    this.getUserRole();
  }

  getUserRole(pageNumber?: number) {
    this.loadingIndicator = true;

    if (pageNumber) {
      this.page.pageNumber = pageNumber;
    }

    this.userRoleService.getAssignedRoles(this.userId, this.page)
      .pipe(
        map(data => ({
          totalElements: data.totalElements,
          totalPages: data.totalPages,
          content: data.content
            .map(content => {
              const { ...others } = content;
              return {
                ...others,
                roleName: content.role.name
              }
            })
        })),
        finalize(() => this.loadingIndicator = false)
      )
      .subscribe(data => {
        this.page.totalElements = data.totalElements;
        this.page.totalPages = data.totalPages;
        this.rows = data.content;
      });
  }

  inactivateUserRole(userRoleId: number) {
    this.userRoleService.deleteAssignedRole(userRoleId)
      .subscribe(data => {
        this.toastr.success(data.message, 'Delete User Role');
        this.getUserRole();
      });
  }
}
