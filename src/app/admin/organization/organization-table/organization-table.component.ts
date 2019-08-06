import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { AdminOrganizationService } from '../organization-service/admin-organization.service';

@Component({
  selector: 'admin-organization-table',
  templateUrl: './organization-table.component.html',
  styleUrls: ['./organization-table.component.css'],
})
export class OrganizationTableComponent implements OnInit {
  @ViewChild('optionsTemplate', { static: true }) optionsTemplate: TemplateRef<
    any
  >;

  columns = [];
  rows = [];
  selected = [];

  constructor(
    private router: Router,
    private adminOrganizationService: AdminOrganizationService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.columns = [
      { name: 'Name' },
      { name: 'Code Name' },
      { name: 'Abbriviation' },
      { name: 'Options', prop: 'options', cellTemplate: this.optionsTemplate },
    ];

    this.adminOrganizationService.getAllOrganization().subscribe(data => {
      this.rows = data;
    });
  }
}
