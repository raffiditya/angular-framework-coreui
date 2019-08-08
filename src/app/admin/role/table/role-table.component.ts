import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminRoleService } from '../admin-role.service';

@Component({
  selector: 'role-menu-table',
  templateUrl: './role-table.component.html',
  styles: [
    `
      @media screen and (max-width: 1200px) {
        .title-hidden {
          display: none;
        }
      }
      @media screen and (max-width: 992px) {
        .url-hidden {
          display: none;
        }
      }
      @media screen and (max-width: 800px) {
        .active-hidden {
          display: none;
        }
      }
    `,
  ],
})
export class RoleTableComponent implements OnInit {
  @ViewChild('roleTable', { static: false }) table: any;

  page = {
    size: 0,
    totalElements: 0,
    totalPages: 0,
    pageNumber: 0,
  };
  rows = [];
  expanded: any = {};
  timeout: any;

  constructor(
    private router: Router,
    private adminRoleService: AdminRoleService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
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
        console.log(this.rows);
      });
  }

  onDisabled(activeStatus) {
    if (activeStatus === 'Y') {
      return false;
    } else {
      return true;
    }
  }

  selectInactive(row) {
    this.adminRoleService.deleteRole(row.id).subscribe(data => {
      console.log(data);
      for (let i = 0; i < this.rows.length; i++) {
        if (this.rows[i].id === row.id) {
          this.rows[i] = data;
          this.rows = [...this.rows];
        }
      }
    });
  }
}
