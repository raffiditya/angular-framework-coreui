import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminUserService } from '../admin-user.service';
import { Page } from '../../../core/model/page';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  // selector: 'admin-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css'],
})
export class UserTableComponent implements OnInit {
  @ViewChild('userTable', { static: false }) table: any;
  @ViewChild('inactiveModal', { static: false })
  public inactiveModal: ModalDirective;

  page = new Page();
  path = '';
  idInactive: number = 0;
  rows = [];
  searchTerm: string = '';
  
  constructor(
    private adminUserService: AdminUserService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.path = this.activatedRoute.snapshot.data.title;
    this.getUserByPage({ offset: 0 });
  }

  getUserByPage(pageInfo: { offset: any }){
    this.page.pageNumber = pageInfo.offset + 1;
    this.getUser();
  }

  getUser() {
    this.adminUserService
      .getUsers(this.page)
      .subscribe(data => {
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
    this.inactiveModal.show();
  }

  selectInactive() {
    this.adminUserService.deleteUser(this.idInactive).subscribe(data => {
      this.idInactive = 0;
      this.inactiveModal.hide();
      this.toastr.success(data.message, 'Delete User')
      this.getUser();
    });
  }

  onSearchChange(search: any) {
    if(search.length > 0 && search.length < 3){
      return;
    }

    this.table.sorts = [];
    this.page.sort = '';
    this.rows = [];

    if(search.match(/[^a-zA-Z]/g)){
      this.searchTerm = '';
      this.page.searchTerm = this.searchTerm;
      this.getUser();
      return;
    }

    this.page.searchTerm = search;
    this.getUser();
  }

  onSort(event: any) {
    this.page.pageNumber = 1;
    this.page.sort = `${event.column.prop},${event.newValue}`;
    this.getUser();
  }
}
