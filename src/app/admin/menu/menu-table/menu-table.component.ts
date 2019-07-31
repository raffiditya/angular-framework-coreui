import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core'

import { Router, ActivatedRoute } from '@angular/router'
import { NavigationService } from '../../../core/services/navigation.service'

@Component({
  selector: 'cms-menu-table',
  templateUrl: './menu-table.component.html',
  styleUrls: ['./menu-table.component.css']
})
export class MenuTableComponent implements OnInit {
  @ViewChild('optionsTemplate', {static: true}) optionsTemplate: TemplateRef<any>;

  columns = [];
  rows = [];
  selected = [];

  constructor(
    private router: Router,
    private navigationService: NavigationService,
    private activatedRoute: ActivatedRoute,
  ){}

  ngOnInit() {
    this.columns = [
      { name: 'Name' },
      { name: 'URL' },

      { name: 'Options', prop: 'options', cellTemplate: this.optionsTemplate },
    ];

    // this.navigationService.getMenu()
    //   .subscribe(
    //     (data) => {
    //       const dataObject = JSON.parse(data['_body'])
    //       this.rows = dataObject
    //     }
    //   )
  }

  onDeleteData(row) {
    // this.menuService.deleteSingleData(row.id)
    //   .subscribe(
    //     (data) => {
    //       const dataObject = JSON.parse(data['_body'])

    //       for (let i = this.rows.length - 1; i >= 0; i--) {
    //         if (this.rows[i].id === row.id) {
    //           this.rows.splice(i, 1);
    //         }
    //       }
    //     }
    //   )
  }
}
