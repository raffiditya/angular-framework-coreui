import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminRoleService } from '../admin-role.service';
import { Page } from '../../../core/model/page';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'role-menu-table',
  templateUrl: './role-table.component.html',
  styleUrls: ['./role-table.component.css'],
})
export class RoleTableComponent implements OnInit {
  @ViewChild('roleTable', { static: false }) table: any;
  @ViewChild('dangerModal', { static: false })
  public dangerModal: ModalDirective;

  page = new Page();
  path = '';
  id_inactive = '';
  rows = [];
  keyword = '';
  expanded: any = {};
  loadingIndicator: boolean = true;

  constructor(
    private adminRoleService: AdminRoleService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    this.path = this.activatedRoute.snapshot.data.title;
    this.getRole({ offset: 0 });
  }

  getRole(pageInfo) {
    this.page.pageNumber = pageInfo.offset;

    this.adminRoleService
      .getAllRoles(this.page.pageNumber, this.page.size)
      .subscribe(data => {
        this.page.totalElements = data.totalElements;
        this.page.totalPages = data.totalPages;

        this.rows = data['content'];
      });
  }

  onDisabled(activeStatus) {
    if (activeStatus === 'Y') {
      return false;
    } else {
      return true;
    }
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  open(row: any) {
    this.id_inactive = row.id;
    this.dangerModal.show();
  }

  selectInactive() {
    this.adminRoleService.deleteRole(this.id_inactive).subscribe(data => {
      this.id_inactive = '';
      this.dangerModal.hide();
      this.showSuccess();
      this.getRole({ offset: 0 });
    });
  }

  showSuccess() {
    this.toastr.success('Role is inactive');
  }

  onSearchChange(search: any) {
    this.keyword = search;

    this.adminRoleService.searchRole(search).subscribe(data => {
      this.reset();
      this.rows = data['content'];
    });
  }

  reset() {
    this.table.sorts = [];
  }

  onSort(event: any) {
    this.adminRoleService
      .sortRole(
        this.keyword,
        this.page.pageNumber,
        event.column.prop,
        event.newValue,
      )
      .subscribe(data => {
        this.rows = data['content'];
      });
  }
}
