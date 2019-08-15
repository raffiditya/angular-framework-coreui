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
  id_inactive = '';
  path = '';
  rows = [];
  keyword = '';
  expanded: any = {};

  constructor(
    private adminMenuService: AdminMenuService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    this.path = this.activatedRoute.snapshot.data.title;
    this.getMenu({ offset: 0 });
  }

  getMenu(pageInfo: { offset: any }) {
    this.page.pageNumber = pageInfo.offset;

    this.adminMenuService
      .getAllMenu(this.page.pageNumber, this.page.size)
      .subscribe(data => {
        this.page.totalElements = data.totalElements;
        this.page.totalPages = data.totalPages;

        this.rows = data['content'];
      });
  }

  onDisabled(activeStatus: string) {
    if (activeStatus === 'Y') {
      return false;
    } else {
      return true;
    }
  }

  toggleExpandRow(row: any) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  open(row: any) {
    this.id_inactive = row.id;
    this.dangerModal.show();
  }

  selectInactive() {
    this.adminMenuService.deleteMenu(this.id_inactive).subscribe(data => {
      this.id_inactive = '';
      this.dangerModal.hide();
      this.showSuccess();
      this.getMenu({ offset: 0 });
    });
  }

  showSuccess() {
    this.toastr.success('Menu is inactivated', 'Delete Menu');
  }

  onSearchChange(search: any) {
    this.keyword = search;

    this.adminMenuService.searchMenu(search).subscribe(data => {
      this.reset();
      this.rows = data['content'];
    });
  }

  reset() {
    this.table.sorts = [];
  }

  onSort(event: any) {
    this.adminMenuService
      .sortMenu(
        this.keyword,
        this.page.pageNumber,
        event.column.prop,
        event.newValue,
      )
      .subscribe(data => {
        this.rows = data['content'];
      });
  }
}
