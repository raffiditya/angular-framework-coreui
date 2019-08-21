import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminRolePrivilegeService } from '../role-privilege.service';
import { Page } from '../../../../core/model/page';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'role-privilege-table',
  templateUrl: './role-privilege-table.component.html',
  styleUrls: ['./role-privilege-table.component.css'],
})
export class RolePrivilegeTableComponent implements OnInit {
  @ViewChild('rolePrivilege', { static: false }) table: any;

  id: number = 0;
  page = new Page();
  path: string = '';
  idInactive: string = '';
  rows: any = [];
  searchTerm: string = '';

  constructor(
    private adminRolePrivilegeService: AdminRolePrivilegeService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.path = this.activatedRoute.snapshot.data.title;
    this.getRolePrivilegeByPage({ offset: 0 });
  }

  getRolePrivilegeByPage(pageInfo: { offset: any }) {
    this.page.pageNumber = pageInfo.offset + 1;
    this.getRolePrivilage();
  }

  getRolePrivilage() {
    this.adminRolePrivilegeService
      .getAssignedPrivilege(this.id, this.page)
      .subscribe(data => {
        this.page.totalElements = data.totalElements;
        this.page.totalPages = data.totalPages;
        this.rows = data['content'];
      });
  }

  toggleExpandRow(row: any) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  onSearchChange(search: string) {
    if (search.length > 0 && search.length < 3) {
      return;
    }

    this.table.sorts = [];
    this.page.sort = '';
    this.rows = [];

    if (search.match(/[^a-zA-Z ]/g)) {
      return;
    }

    this.page.searchTerm = search;
    this.getRolePrivilage();
  }

  onSort(event: any) {
    this.page.pageNumber = 1;
    this.page.sort = `${event.column.prop},${event.newValue}`;
    this.getRolePrivilage();
  }
}
