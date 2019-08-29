import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { finalize, map } from "rxjs/operators";
import { Page } from '../../../../core/model/page';
import { sortTable } from '../../../../util';
import { RolePrivilegeService } from '../../../service/role-privilege.service';

@Component({
  selector: 'role-privilege-table',
  templateUrl: './role-privilege-table.component.html'
})
export class RolePrivilegeTableComponent implements OnInit {

  ColumnMode = ColumnMode;
  @Input() editable: boolean;
  loadingIndicator: boolean;
  page: Page = new Page();
  roleId: number;
  rows: any[] = [];
  sortTable: Function = sortTable;

  constructor(
    private adminRolePrivilegeService: RolePrivilegeService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.roleId = Number(this.activatedRoute.snapshot.paramMap.get('roleId'));
    this.getRolePrivilege();
  }

  getRolePrivilege(pageNumber?: number) {
    this.loadingIndicator = true;

    if (pageNumber) {
      this.page.pageNumber = pageNumber;
    }

    this.adminRolePrivilegeService.getAssignedPrivileges(this.roleId, this.page)
      .pipe(
        map(data => ({
          totalElements: data.totalElements,
          totalPages: data.totalPages,
          content: data.content
            .map(content => {
              const { ...others } = content;
              return {
                ...others,
                privilegeName: content.privilege.name
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
}
