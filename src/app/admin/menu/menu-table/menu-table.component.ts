import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { AdminMenuService } from '../menu-service/admin-menu.service';

@Component({
  selector: 'cms-menu-table',
  templateUrl: './menu-table.component.html',
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
export class MenuTableComponent implements OnInit {
  @ViewChild('myTable', { static: false }) table: any;

  rows: any[] = [];
  expanded: any = {};
  timeout: any;
  loadingIndicator: boolean = true;

  constructor(
    private router: Router,
    private adminMenuService: AdminMenuService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.adminMenuService.getAllMenu().subscribe(data => {
      this.rows = data['content'];
    });
  }

  setPage(event) {}

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
