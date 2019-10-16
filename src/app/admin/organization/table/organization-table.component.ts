import { Component, OnInit } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { finalize } from 'rxjs/operators';
import { PagedApiResponse, PageRequest } from '../../../lib/model';
import { sortTableFn } from '../../../util';
import { Organization } from '../../model';
import { OrganizationService } from '../../service';

@Component({
  templateUrl: './organization-table.component.html'
})
export class OrganizationTableComponent implements OnInit {

  ColumnMode = ColumnMode;
  data: PagedApiResponse<Organization>;
  loadingIndicator: boolean;
  page: PageRequest = new PageRequest();
  sortTableFn: Function = sortTableFn;

  constructor(private organizationService: OrganizationService) {}

  get offset(): number {
    return !!(this.data && this.data.number) ? this.data.number : 0;
  }

  get rows(): Array<Organization> {
    return !!(this.data && this.data.content) ? this.data.content : [];
  }

  get totalElements(): number {
    return !!(this.data && this.data.totalElements) ? this.data.totalElements : 0;
  }

  ngOnInit() {
    this.getOrganization();
  }

  getOrganization(pageNumber: number = 1) {
    this.loadingIndicator = true;
    this.page.page = pageNumber;

    this.organizationService.getTableRows(this.page)
      .pipe(
        finalize(() => this.loadingIndicator = false)
      )
      .subscribe(data => this.data = data);
  }

  inactivateOrg(orgId: number) {
    this.organizationService.delete(orgId)
      .subscribe(() => this.getOrganization());
  }
}
