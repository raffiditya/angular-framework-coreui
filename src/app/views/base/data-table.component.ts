import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';


@Component({
  templateUrl: './data-table.component.html'
})
export class DataTableComponent implements OnInit {

  @ViewChild('statusTemplate', {static: true}) statusTemplate: TemplateRef<any>;

  columns = [];

  rows = [
    {number: 'A01', name: 'Test 01', status: 1},
    {number: 'A02', name: 'Test 02', status: 2},
    {number: 'A03', name: 'Test 03', status: 3},
    {number: 'A04', name: 'Test 04', status: 4}
  ];

  constructor() {
  }

  ngOnInit() {
    this.columns = [
      {name: 'Number'},
      {name: 'Name'},
      {name: 'Status'},
      {name: 'Status Styling', prop: 'status', cellTemplate: this.statusTemplate}
    ];
  }

}
