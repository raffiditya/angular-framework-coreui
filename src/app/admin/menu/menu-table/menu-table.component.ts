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
  @ViewChild('activeTemplate', { static: true }) activeTemplate: TemplateRef<
    any
  >;
  @ViewChild('titleFlagTemplate', { static: true })
  titleFlagTemplate: TemplateRef<any>;
  @ViewChild('optionsTemplate', { static: true }) optionsTemplate: TemplateRef<
    any
  >;

  columns = [];
  rows = [];
  selected = [];

  constructor(
    private router: Router,
    private adminMenuService: AdminMenuService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.columns = [
      { name: 'Name' },
      { name: 'Url' },
      {
        name: 'Title Flag',
        prop: 'titleFlag',
        cellTemplate: this.titleFlagTemplate,
      },
      { name: 'Active', prop: 'activeFlag', cellTemplate: this.activeTemplate },
      { name: 'Options', prop: 'options', cellTemplate: this.optionsTemplate },
    ];

    this.adminMenuService.getAllMenu().subscribe(data => {
      this.rows = data['content'];
      // console.log(this.rows)
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
    console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
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
