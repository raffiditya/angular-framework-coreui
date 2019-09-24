import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { Page } from '../../../core/model/page.model';
import { sortTable } from '../../../util';
import { MenuService } from '../../service/menu.service';

@Component({
  templateUrl: './menu-table.component.html'
})
export class MenuTableComponent implements OnInit {

  ColumnMode = ColumnMode;
  loadingIndicator: boolean;
  page: Page = new Page();
  rows: any[] = [];
  sortTable: Function = sortTable;

  constructor(
    private menuService: MenuService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getMenu();
  }

  getMenu(pageNumber?: number) {
    this.loadingIndicator = true;

    if (pageNumber) {
      this.page.pageNumber = pageNumber;
    }

    this.menuService.getMenus(this.page)
      .pipe(
        finalize(() => this.loadingIndicator = false)
      )
      .subscribe(data => {
        this.page.totalElements = data.totalElements;
        this.page.totalPages = data.totalPages;
        this.rows = data.content;
      });
  }

  inactivateMenu(menuId: number) {
    this.menuService.deleteMenu(menuId)
      .subscribe(data => {
        this.toastr.success(data.message, 'Delete Menu');
        this.getMenu();
      });
  }
}
