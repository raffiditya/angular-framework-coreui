import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { finalize } from 'rxjs/operators';
import { PagedApiResponse, PageRequest } from '../../../../lib/model';
import { sortTableFn } from '../../../../util';
import { RoleMenu } from '../../../model';
import { RoleMenuService } from '../../../service';

@Component({
  selector: 'role-menu-table',
  templateUrl: './role-menu-table.component.html'
})
export class RoleMenuTableComponent implements OnInit {

  ColumnMode = ColumnMode;
  data: PagedApiResponse<RoleMenu>;
  @Input() editable: boolean;
  loadingIndicator: boolean;
  page: PageRequest = new PageRequest();
  roleId: number;
  sortTableFn: Function = sortTableFn;

  constructor(
    private roleMenuService: RoleMenuService,
    private activatedRoute: ActivatedRoute
  ) {}

  get offset(): number {
    return !!(this.data && this.data.number) ? this.data.number : 0;
  }

  get rows(): Array<RoleMenu> {
    return !!(this.data && this.data.content) ? this.data.content : [];
  }

  get totalElements(): number {
    return !!(this.data && this.data.totalElements) ? this.data.totalElements : 0;
  }

  ngOnInit() {
    this.roleId = Number(this.activatedRoute.snapshot.paramMap.get('roleId'));
    this.getRoleMenu();
  }

  getRoleMenu(pageNumber: number = 1) {
    this.loadingIndicator = true;
    this.page.page = pageNumber;

    this.roleMenuService
      .getRowsFromRelation(this.page, this.roleId)
      .pipe(
        finalize(() => this.loadingIndicator = false)
      )
      .subscribe(data => this.data = data);
  }

  inactivateRoleMenu(roleMenuId: number) {
    this.roleMenuService.delete(roleMenuId)
      .subscribe(() => this.getRoleMenu());
  }
}
