import { Component, OnInit } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { finalize } from 'rxjs/operators';
import { PagedApiResponse, PageRequest } from '../../../lib/model';
import { sortTableFn } from '../../../util';
import { Role } from '../../model';
import { RoleService } from '../../service';

@Component({
  templateUrl: './role-table.component.html'
})
export class RoleTableComponent implements OnInit {

  ColumnMode = ColumnMode;
  data: PagedApiResponse<Role>;
  loadingIndicator: boolean;
  page: PageRequest = new PageRequest();
  sortTableFn: Function = sortTableFn;

  constructor(private roleService: RoleService) {}

  get offset(): number {
    return !!(this.data && this.data.number) ? this.data.number : 0;
  }

  get rows(): Array<Role> {
    return !!(this.data && this.data.content) ? this.data.content : [];
  }

  get totalElements(): number {
    return !!(this.data && this.data.totalElements) ? this.data.totalElements : 0;
  }

  ngOnInit() {
    this.getRole();
  }

  getRole(pageNumber: number = 1) {
    this.loadingIndicator = true;
    this.page.page = pageNumber;

    this.roleService
      .getTableRows(this.page)
      .pipe(
        finalize(() => this.loadingIndicator = false)
      )
      .subscribe(data => this.data = data);
  }

  inactivateRole(roleId: number) {
    this.roleService.delete(roleId)
      .subscribe(() => this.getRole());
  }
}
