import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { AdminUsersService } from '../admin-user.service';
import { Page } from '../../../core/model/page';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'admin-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css'],
})
export class UserTableComponent implements OnInit {
  @ViewChild('userTable', { static: false }) table: any;
  @ViewChild('dangerModal', { static: false })
  public dangerModal: ModalDirective;

  page = new Page();
  path = '';
  id_inactive = '';
  rows = [];
  keyword = '';
  expanded: any = {};

  constructor(
    private adminUserService: AdminUsersService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    this.path = this.activatedRoute.snapshot.data.title;
    this.getUser({ offset: 0 });
  }

  getUser(pageInfo: { offset: any }) {
    this.page.pageNumber = pageInfo.offset;

    this.adminUserService
      .getAllUser(this.page.pageNumber, this.page.size)
      .subscribe(data => {
        this.page.totalElements = data.totalElements;
        this.page.totalPages = data.totalPages;
        this.rows = data['content'];
      });
  }

  onDisabled(activeStatus: string) {
    if (activeStatus === 'Y') {
      return false;
    } else {
      return true;
    }
  }

  toggleExpandRow(row: any) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  open(row: any) {
    this.id_inactive = row.id;
    this.dangerModal.show();
  }

  selectInactive() {
    this.adminUserService.deleteUser(this.id_inactive).subscribe(data => {
      this.id_inactive = '';
      this.dangerModal.hide();
      this.showSuccess();
      this.getUser({ offset: 0 });
    });
  }

  showSuccess() {
    this.toastr.success('message', 'Delete Role');
  }

  onSearchChange(search: any) {
    this.keyword = search;

    if (this.keyword.length >= 3) {
      this.adminUserService.searchUser(search).subscribe(data => {
        this.reset();
        this.rows = data['content'];
      });
    } else {
      this.getUser({ offset: 0 });
    }
  }

  reset() {
    this.table.sorts = [];
  }

  onSort(event: any) {
    this.adminUserService
      .sortUser(
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
