import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { finalize } from 'rxjs/operators';
import { PagedApiResponse, PageRequest } from '../../../../lib/model';
import { sortTableFn } from '../../../../util';
import { RolePrivilege } from '../../../model';
import { RolePrivilegeService } from '../../../service';

@Component({
  selector: 'role-privilege-table',
  templateUrl: './role-privilege-table.component.html'
})
export class RolePrivilegeTableComponent implements OnInit {

  ColumnMode = ColumnMode;
  data: PagedApiResponse<RolePrivilege>;
  @Input() editable: boolean;
  loadingIndicator: boolean;
  page: PageRequest = new PageRequest();
  roleId: number;
  sortTableFn: Function = sortTableFn;

  constructor(
    private rolePrivilegeService: RolePrivilegeService,
    private activatedRoute: ActivatedRoute
  ) {}

  get offset(): number {
    return !!(this.data && this.data.number) ? this.data.number : 0;
  }

  get rows(): Array<RolePrivilege> {
    return !!(this.data && this.data.content) ? this.data.content : [];
  }

  get totalElements(): number {
    return !!(this.data && this.data.totalElements) ? this.data.totalElements : 0;
  }

  ngOnInit() {
    this.roleId = Number(this.activatedRoute.snapshot.paramMap.get('roleId'));
    this.getRolePrivilege();
  }

  getRolePrivilege(pageNumber: number = 1) {
    this.loadingIndicator = true;
    this.page.page = pageNumber;

    this.rolePrivilegeService
      .getRowsFromRelation(this.page, this.roleId)
      .pipe(
        finalize(() => this.loadingIndicator = false)
      )
      .subscribe(data => this.data = data);
  }
}
