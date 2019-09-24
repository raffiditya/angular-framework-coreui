import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { finalize, map } from 'rxjs/operators';
import { Page } from '../../../../core/model/page.model';
import { sortTable } from '../../../../util';
import { RoleMenuService } from '../../../service/role-menu.service';

@Component({
  selector: 'role-menu-table',
  templateUrl: './role-menu-table.component.html'
})
export class RoleMenuTableComponent implements OnInit {

  ColumnMode = ColumnMode;
  @Input() editable: boolean;
  loadingIndicator: boolean;
  page: Page = new Page();
  roleId: number;
  rows: any[] = [];
  sortTable: Function = sortTable;

  constructor(
    private adminRoleMenuService: RoleMenuService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.roleId = Number(this.activatedRoute.snapshot.paramMap.get('roleId'));
    this.getRoleMenu();
  }

  getRoleMenu(pageNumber?: number) {
    this.loadingIndicator = true;

    if (pageNumber) {
      this.page.pageNumber = pageNumber;
    }

    this.adminRoleMenuService.getAssignedMenus(this.roleId, this.page)
      .pipe(
        map(data => ({
          totalElements: data.totalElements,
          totalPages: data.totalPages,
          content: data.content
            .map(content => {
              const { ...others } = content;
              return {
                ...others,
                menuName: content.menu.name
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

  inactivateRoleMenu(roleMenuId: number) {
    this.adminRoleMenuService.deleteAssignedMenu(roleMenuId)
      .subscribe(data => {
        this.toastr.success(data.message, 'Delete Role Menu');
        this.getRoleMenu();
      });
  }
}
