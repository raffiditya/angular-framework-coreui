import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminMenuService } from '../admin-menu.service';
import { Page } from '../../../core/model/page';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  templateUrl: './menu-table.component.html',
  styleUrls: ['./menu-table.component.css'],
})
export class MenuTableComponent implements OnInit {
  @ViewChild('myTable', { static: false }) table: any;
  @ViewChild('deleteMenuModal', { static: false })
  public deleteMenuModal: ModalDirective;

  page = new Page();
  path: string = '';
  idInactive: string = '';
  rows: any = [];

  constructor(
    private adminMenuService: AdminMenuService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.path = this.activatedRoute.snapshot.data.title;
    this.getMenuByPage({ offset: 0 });
  }

  getMenuByPage(pageInfo: { offset: any }) {
    this.page.pageNumber = pageInfo.offset + 1;
    this.getMenu();
  }

  getMenu() {
    this.adminMenuService.getMenus(this.page).subscribe(data => {
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
    this.deleteMenuModal.show();
  }

  selectInactive() {
    this.adminMenuService.deleteMenu(this.idInactive).subscribe(data => {
      this.idInactive = '';
      this.deleteMenuModal.hide();
      this.toastr.success(data.message, 'Delete Menu');
      this.getMenu();
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
    this.getMenu();
  }

  onSort(event: any) {
    this.page.pageNumber = 1;
    this.page.sort = `${event.column.prop},${event.newValue}`;
    this.getMenu();
  }
}
