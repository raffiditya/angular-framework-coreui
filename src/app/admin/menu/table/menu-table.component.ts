import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminMenuService } from '../admin-menu.service';
import { Page } from '../../../core/model/page';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'cms-menu-table',
  templateUrl: './menu-table.component.html',
  styleUrls: ['./menu-table.component.css'],
})
export class MenuTableComponent implements OnInit {
  @ViewChild('myTable', { static: false }) table: any;
  @ViewChild('dangerModal', { static: false })
  public dangerModal: ModalDirective;

  page = new Page();
  path = ''
  idInactive = '';
  rows = [];

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
    this.dangerModal.show();
  }

  selectInactive() {
    this.adminMenuService.deleteMenu(this.idInactive).subscribe(data => {
      this.idInactive = '';
      this.dangerModal.hide();
      this.toastr.success(data.message, 'Delete Menu');
      this.getMenu();
    });
  }

  onSearchChange(search: any) {
    this.table.sorts = [];
    this.rows = [];

    if (search.length >= 3) {
      this.page.searchTerm = search;
      this.getMenu();
    } else if (search.length === 0) {
      this.page.searchTerm = '';
      this.getMenu();
    }
  }

  onSort(event: any) {
    this.page.pageNumber = 1;
    this.page.sort = `${event.column.prop}, ${event.newValue}`;
    this.getMenu();
  }
}
