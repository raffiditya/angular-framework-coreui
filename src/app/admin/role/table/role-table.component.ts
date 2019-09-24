import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { Page } from '../../../core/model/page.model';
import { sortTable } from '../../../util';
import { RoleService } from '../../service/role.service';

@Component({
  templateUrl: './role-table.component.html'
})
export class RoleTableComponent implements OnInit {

  ColumnMode = ColumnMode;
  loadingIndicator: boolean;
  page: Page = new Page();
  rows: any[] = [];
  sortTable: Function = sortTable;

  constructor(
    private adminRoleService: RoleService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getRole();
  }

  getRole(pageNumber?: number) {
    this.loadingIndicator = true;

    if (pageNumber) {
      this.page.pageNumber = pageNumber;
    }

    this.adminRoleService.getRoles(this.page)
      .pipe(
        finalize(() => this.loadingIndicator = false)
      )
      .subscribe(data => {
        this.page.totalElements = data.totalElements;
        this.page.totalPages = data.totalPages;
        this.rows = data['content'];
      });
  }

  inactivateRole(roleId: number) {
    this.adminRoleService.deleteRole(roleId)
      .subscribe(data => {
        this.toastr.success(data.message, 'Delete Role');
        this.getRole();
      });
  }
}
