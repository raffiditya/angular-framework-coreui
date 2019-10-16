import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { finalize } from 'rxjs/operators';
import { PagedApiResponse, PageRequest } from '../../../../lib/model';
import { sortTableFn } from '../../../../util';
import { UserOrg } from '../../../model';
import { UserOrganizationService } from '../../../service';

@Component({
  selector: 'user-organization-table',
  templateUrl: './user-organization-table.component.html'
})
export class UserOrganizationTableComponent implements OnInit {

  ColumnMode = ColumnMode;
  data: PagedApiResponse<UserOrg>;
  @Input() editable: boolean;
  loadingIndicator: boolean;
  page: PageRequest = new PageRequest();
  sortTableFn: Function = sortTableFn;
  userId: number;

  constructor(
    private userOrganizationService: UserOrganizationService,
    private activatedRoute: ActivatedRoute
  ) {}

  get offset(): number {
    return !!(this.data && this.data.number) ? this.data.number : 0;
  }

  get rows(): Array<UserOrg> {
    return !!(this.data && this.data.content) ? this.data.content : [];
  }

  get totalElements(): number {
    return !!(this.data && this.data.totalElements) ? this.data.totalElements : 0;
  }

  ngOnInit() {
    this.userId = Number(this.activatedRoute.snapshot.paramMap.get('userId'));
    this.getUserOrganization();
  }

  getUserOrganization(pageNumber: number = 1) {
    this.loadingIndicator = true;
    this.page.page = pageNumber;

    this.userOrganizationService
      .getRowsFromRelation(this.page, this.userId)
      .pipe(
        finalize(() => this.loadingIndicator = false)
      )
      .subscribe(data => this.data = data);
  }

  inactivateUserOrg(userOrgId: number) {
    this.userOrganizationService
      .delete(userOrgId)
      .subscribe(() => this.getUserOrganization());
  }
}
