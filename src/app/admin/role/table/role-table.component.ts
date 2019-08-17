import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminRoleService } from '../admin-role.service';
import { Page } from '../../../core/model/page';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'role-menu-table',
  templateUrl: './role-table.component.html',
  styleUrls: ['./role-table.component.css'],
})
export class RoleTableComponent implements OnInit {
  @ViewChild('roleTable', { static: false }) table: any;
  @ViewChild('dangerModal', { static: false })
  public dangerModal: ModalDirective;

  page = new Page();
  path = '';
  idInactive = '';
  rows = [];

  constructor(
    private adminRoleService: AdminRoleService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.path = this.activatedRoute.snapshot.data.title;
    this.getRole();
  }

  getRoleByPahe(pageInfo: { offset: any }) {
    this.page.pageNumber = pageInfo.offset + 1;
    this.getRole();
  }

  getRole() {
    this.adminRoleService.getRoles(this.page).subscribe(data => {
      this.page.totalElements = data.totalElements;
      this.page.totalPages = data.totalPages;
      this.rows = data['content'];
    });
  }

  disableDeleteButton(activeStatus: string) {
    if (activeStatus === 'Y') {
      return false;
    } else {
      return true;
    }
  }

  toggleExpandRow(row: any) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  openDeleteModal(row: any) {
    this.idInactive = row.id;
    this.dangerModal.show();
  }

  onDeleteRole() {
    this.adminRoleService.deleteRole(this.idInactive).subscribe(data => {
      this.idInactive = '';
      this.dangerModal.hide();
      this.toastr.success(data.message, 'Delete Role');
      this.getRole();
    });
  }

  onSearchChange(search: any) {
    this.table.sorts = [];
    this.rows = []

    if (search.length >= 3) {
      this.page.searchTerm = search
      this.getRole()
    } else if (search.length === 0) {
      this.page.searchTerm = '';
      this.getRole()
    }
  }

  onSort(event: any) {
    this.page.pageNumber = 1
    this.page.sort = `${event.column.prop}, ${event.newValue}`
    this.getRole()
  }
}
