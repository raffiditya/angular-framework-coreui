import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminRoleService } from '../admin-role.service';

@Component({
  selector: 'role-menu-table',
  templateUrl: './role-table.component.html',
  styleUrls: ['./role-table.component.css'],
})
export class RoleTableComponent implements OnInit {
  @ViewChild('roleTable', { static: false }) table: any;

  page = {
    size: 0,
    totalElements: 0,
    totalPages: 0,
    pageNumber: 0,
  };
  path = '';
  rows = [];
  keyword = '';
  expanded: any = {};
  loadingIndicator: boolean = true;

  constructor(
    private router: Router,
    private adminRoleService: AdminRoleService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    this.path = this.activatedRoute.snapshot.data.title;
    this.setPage({ offset: 0 });
  }

  setPage(pageInfo) {
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

  selectInactive(row) {
    this.adminRoleService.deleteRole(row.id).subscribe(data => {
      for (let i = 0; i < this.rows.length; i++) {
        if (this.rows[i].id === row.id) {
          this.rows[i].activeFlag = 'N';
          this.rows = [...this.rows];
        }
      }
    });
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
