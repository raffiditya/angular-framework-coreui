import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core'

import { Router, ActivatedRoute } from '@angular/router'
import { AdminMenuService } from '../menu-service/admin-menu.service'

@Component({
  selector: 'cms-menu-table',
  templateUrl: './menu-table.component.html',
  styleUrls: ['./menu-table.component.css'],
})
export class MenuTableComponent implements OnInit {
  @ViewChild('activeTemplate', { static: true }) activeTemplate: TemplateRef<
    any
  >
  @ViewChild('titleFlagTemplate', { static: true })
  titleFlagTemplate: TemplateRef<any>
  @ViewChild('optionsTemplate', { static: true }) optionsTemplate: TemplateRef<
    any
  >

  columns = []
  rows = []
  selected = []

  constructor(
    private router: Router,
    private adminMenuService: AdminMenuService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.columns = [
      { name: 'Name' },
      { name: 'Url' },
      { name: 'Active', prop: 'activeFlag', cellTemplate: this.activeTemplate },
      {
        name: 'Title Flag',
        prop: 'titleFlag',
        cellTemplate: this.titleFlagTemplate,
      },
      { name: 'Options', prop: 'options', cellTemplate: this.optionsTemplate },
    ]

    this.adminMenuService.getAllMenu().subscribe(data => {
      this.rows = data['content']
      // console.log(this.rows)
    })
  }

  selectInactive(row) {
    this.adminMenuService.getMenu(row.id).subscribe(data => {
      let newFormValue = {
        activeFlag: 'N',
        name: data['name'],
        description: data['description'],
        url: data['url'],
        icon: data['icon'],
        orderNo: data['orderNo'],
        titleFlag: data['titleFlag'],
        parentId: data['parentId'],
      }

      this.onUpdateData(row.id, newFormValue)
    })
  }

  onUpdateData(id, menu) {
    this.adminMenuService.editMenu(id, menu).subscribe(data => {
      for (let i = 0; i < this.rows.length; i++) {
        if (this.rows[i].id === id) {
          this.rows[i] = data
          this.rows = [...this.rows]
        }
      }
    })
  }
}
