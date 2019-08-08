import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { AdminMenuService } from '../menu-service/admin-menu.service';

@Component({
  selector: 'cms-menu-table',
  templateUrl: './menu-table.component.html',
  styleUrls: ['./menu-table.component.css'],
})
export class MenuTableComponent implements OnInit {
  @ViewChild('myTable', { static: false }) table: any;

  page = {
    size: 0,
    totalElements: 0,
    totalPages: 0,
    pageNumber: 0,
  };
  rows = [];
  expanded: any = {};
  timeout: any;
  loadingIndicator: boolean = true;

  constructor(
    private router: Router,
    private adminMenuService: AdminMenuService,
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

    this.adminMenuService
      .getAllMenu(this.page.pageNumber, this.page.size)
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

  selectInactive(row) {
    this.adminMenuService.getMenu(row.id).subscribe(data => {
      for (let i = 0; i < this.rows.length; i++) {
        if (this.rows[i].id === row.id) {
          this.rows[i] = data;
          this.rows = [...this.rows];
        }
      }
    });
  }
}
