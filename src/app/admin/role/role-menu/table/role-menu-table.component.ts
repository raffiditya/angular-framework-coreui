import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminRoleMenuService } from '../role-menu.service';
import { Page } from '../../../../core/model/page';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'role-menu-table',
  templateUrl: './role-menu-table.component.html',
  styleUrls: ['./role-menu-table.component.css'],
})
export class RoleMenuTableComponent implements OnInit {
  @ViewChild('roleTable', { static: false }) table: any;
  @ViewChild('dangerModal', { static: false })
  public dangerModal: ModalDirective;

  id: number = 0;
  page = new Page();
  path: string = '';
  idInactive: string = '';
  rows: any = [];

  constructor(
    private adminRoleMenuService: AdminRoleMenuService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.path = this.activatedRoute.snapshot.data.title;
    this.getRoleMenuByPage({ offset: 0 });
  }

  getRoleMenuByPage(pageInfo: { offset: any }) {
    this.page.pageNumber = pageInfo.offset + 1;
    this.getRoleMenu();
  }

  getRoleMenu() {
    this.page.roleId = this.id;
    this.adminRoleMenuService.getAssignedMenus(this.page).subscribe(data => {
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

  selectInactive() {
    this.adminRoleMenuService
      .deleteAssignedMenu(this.idInactive)
      .subscribe(data => {
        this.idInactive = '';
        this.dangerModal.hide();
        this.toastr.success(data.message, 'Delete Menu');
        this.getRoleMenu();
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
    this.getRoleMenu();
  }

  onSort(event: any) {
    this.page.pageNumber = 1;
    this.page.sort = `${event.column.prop},${event.newValue}`;
    this.getRoleMenu();
  }
}
