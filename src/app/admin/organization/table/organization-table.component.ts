import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { Page } from '../../../core/model/page.model';
import { sortTable } from '../../../util';
import { OrganizationService } from '../../service/organization.service';

@Component({
  templateUrl: './organization-table.component.html'
})
export class OrganizationTableComponent implements OnInit {

  ColumnMode = ColumnMode;
  loadingIndicator: boolean;
  page: Page = new Page();
  rows: any[] = [];
  sortTable: Function = sortTable;

  constructor(
    private adminOrganizationService: OrganizationService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getOrganization();
  }

  getOrganization(pageNumber?: number) {
    this.loadingIndicator = true;

    if (pageNumber) {
      this.page.pageNumber = pageNumber;
    }

    this.adminOrganizationService.getOrganizations(this.page)
      .pipe(
        finalize(() => this.loadingIndicator = false)
      )
      .subscribe(data => {
        this.page.totalElements = data.totalElements;
        this.page.totalPages = data.totalPages;
        this.rows = data.content;
      });
  }

  inactivateOrg(orgId: number) {
    this.adminOrganizationService.deleteOrganization(orgId)
      .subscribe(data => {
        this.toastr.success(data.message, 'Delete Organization');
        this.getOrganization();
      });
  }
}
