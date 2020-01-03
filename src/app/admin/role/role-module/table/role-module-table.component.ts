import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { finalize } from 'rxjs/operators';
import { PagedApiResponse, PageRequest } from '../../../../lib/model';
import { sortTableFn } from '../../../../util';
import { RoleModule } from '../../../model';
import { RoleModuleService } from '../../../service';

@Component({
  selector: 'role-module-table',
  templateUrl: './role-module-table.component.html'
})
export class RoleModuleTableComponent implements OnInit {

  ColumnMode = ColumnMode;
  data: PagedApiResponse<RoleModule>;
  @Input() editable: boolean;
  loadingIndicator: boolean;
  page: PageRequest = new PageRequest();
  roleId: number;
  sortTableFn: Function = sortTableFn;

  constructor(
    private roleModuleService: RoleModuleService,
    private activatedRoute: ActivatedRoute
  ) {}

  get offset(): number {
    return !!(this.data && this.data.number) ? this.data.number : 0;
  }

  get rows(): Array<RoleModule> {
    return !!(this.data && this.data.content) ? this.data.content : [];
  }

  get totalElements(): number {
    return !!(this.data && this.data.totalElements) ? this.data.totalElements : 0;
  }

  ngOnInit() {
    this.roleId = Number(this.activatedRoute.snapshot.paramMap.get('roleId'));
    this.getRoleModule();
  }

  getRoleModule(pageNumber: number = 1) {
    this.loadingIndicator = true;
    this.page.page = pageNumber;

    this.roleModuleService
      .getRowsFromRelation(this.page, this.roleId)
      .pipe(
        finalize(() => this.loadingIndicator = false)
      )
      .subscribe(data => this.data = data);
  }

  inactivateRoleModule(roleModule: number) {
    this.roleModuleService.delete(roleModule)
      .subscribe(() => this.getRoleModule());
  }
}
