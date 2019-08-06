import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'table-header',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.css'],
})
export class TableHeaderComponent implements OnInit {
  path = '';

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.path = this.activatedRoute.snapshot.data.title;
  }
}
