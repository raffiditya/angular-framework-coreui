import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminUserRoleService } from '../user-role.service';
import { Page } from '../../../../core/model/page';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'user-role-table',
  templateUrl: './user-role-table.component.html',
  styleUrls: ['./user-role-table.component.css'],
})
export class UserRoleTableComponent implements OnInit {
  @ViewChild('userTable', { static: false }) table: any;
  @ViewChild('deleteUserRoleModal', { static: false })
  public deleteUserRoleModal: ModalDirective;

  id: number = 0;
  page = new Page();
  path: string = '';
  idInactive: number = 0;
  rows: any = [];

  constructor(
    private adminUserRoleService: AdminUserRoleService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.path = this.activatedRoute.snapshot.data.title;
    this.getUserRoleByPage({ offset: 0 });
  }

  getUserRoleByPage(pageInfo: { offset: any }) {
    this.page.pageNumber = pageInfo.offset + 1;
    this.getUserRole();
  }

  getUserRole() {
    this.adminUserRoleService.getAssignedRoles(this.id, this.page).subscribe(data => {
      this.page.totalElements = data.totalElements;
      this.page.totalPages = data.totalPages;
      this.rows = data['content'];
    });
  }

  toggleExpandRow(row: any) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  openDeleteModal(row: any) {
    this.idInactive = row.id;
    this.deleteUserRoleModal.show();
  }

  selectInactive() {
    this.adminUserRoleService
      .deleteAssignedRole(this.idInactive)
      .subscribe(data => {
        this.idInactive = 0;
        this.deleteUserRoleModal.hide();
        this.toastr.success(data.message, 'Delete Menu');
        this.getUserRole();
      });
  }

  onSearchChange(search: any) {
    if (search.length > 0 && search.length < 3) {
      return;
    }

    this.table.sorts = [];
    this.page.sort = '';
    this.rows = [];

    if (search.match(/[^a-zA-Z]/g)) {
      return
    }

    this.page.searchTerm = search;
    this.getUserRole();
  }

  onSort(event: any) {
    this.page.pageNumber = 1;
    this.page.sort = `${event.column.prop},${event.newValue}`;
    this.getUserRole();
  }
}
