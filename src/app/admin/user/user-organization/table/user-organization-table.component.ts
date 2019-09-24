import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { finalize, map } from 'rxjs/operators';
import { Page } from '../../../../core/model/page.model';
import { sortTable } from '../../../../util';
import { UserOrganizationService } from '../../../service/user-organization.service';

@Component({
  selector: 'user-organization-table',
  templateUrl: './user-organization-table.component.html'
})
export class UserOrganizationTableComponent implements OnInit {

  ColumnMode = ColumnMode;
  @Input() editable: boolean;
  loadingIndicator: boolean;
  page: Page = new Page();
  rows: any[] = [];
  sortTable: Function = sortTable;
  userId: number;

  constructor(
    private userOrganizationService: UserOrganizationService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.userId = Number(this.activatedRoute.snapshot.paramMap.get('userId'));
    this.getUserOrganization();
  }

  getUserOrganization(pageNumber?: number) {
    this.loadingIndicator = true;

    if (pageNumber) {
      this.page.pageNumber = pageNumber;
    }

    this.userOrganizationService.getAssignedOrganizations(this.userId, this.page)
      .pipe(
        map(data => ({
          totalElements: data.totalElements,
          totalPages: data.totalPages,
          content: data.content
            .map(content => {
              const { ...others } = content;
              return {
                ...others,
                orgName: content.organization.name
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

  inactivateUserOrg(userOrgId: number) {
    this.userOrganizationService.deleteAssignedOrganization(userOrgId)
      .subscribe(data => {
        this.toastr.success(data.message, 'Delete User Organization');
        this.getUserOrganization();
      });
  }
}
