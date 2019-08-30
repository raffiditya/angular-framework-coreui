import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminUserOrganizationService } from '../user-organization.service';
import { Page } from '../../../../core/model/page';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'user-organization-table',
  templateUrl: './user-organization-table.component.html',
  styleUrls: ['./user-organization-table.component.css'],
})
export class UserOrganizationTableComponent implements OnInit {
  @ViewChild('userTable', { static: false }) table: any;
  @ViewChild('deleteUserOrganizationModal', { static: false })
  public deleteUserOrganizationModal: ModalDirective;

  id: number = 0;
  page = new Page();
  path: string = '';
  idInactive: number = 0;
  rows: any = [];

  constructor(
    private adminUserOrganizationService: AdminUserOrganizationService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.path = this.activatedRoute.snapshot.data.title;
    this.getUserOrganizationByPage({ offset: 0 });
  }

  getUserOrganizationByPage(pageInfo: { offset: any }) {
    this.page.pageNumber = pageInfo.offset + 1;
    this.getUserOrganization();
  }

  getUserOrganization() {
    this.adminUserOrganizationService.getAssignedOrganizations(this.id, this.page).subscribe(data => {
      this.page.totalElements = data.totalElements;
      this.page.totalPages = data.totalPages;
      this.rows = data['content'];
    });
  }

  toggleExpandRow(row: any) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  openDeleteModal(row: any) {
    this.idInactive = row.id;
    this.deleteUserOrganizationModal.show();
  }

  selectInactive() {
    this.adminUserOrganizationService
      .deleteAssignedOrganization(this.idInactive)
      .subscribe(data => {
        this.idInactive = 0;
        this.deleteUserOrganizationModal.hide();
        this.toastr.success(data.message, 'Delete Menu');
        this.getUserOrganization();
      });
  }

  onSearchChange(search: any) {
    if (search.length > 0 && search.length < 3) {
      return;
    }

    this.table.sorts = [];
    this.page.sort = '';
    this.rows = [];

    if (search.match(/[^a-zA-Z]/g)) {
      return
    }

    this.page.searchTerm = search;
    this.getUserOrganization();
  }

  onSort(event: any) {
    this.page.pageNumber = 1;
    this.page.sort = `${event.column.prop},${event.newValue}`;
    this.getUserOrganization();
  }
}
