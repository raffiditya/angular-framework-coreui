import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminOrganizationService } from '../admin-organization.service';
import { Page } from '../../../core/model/page';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal'

@Component({
  templateUrl: './organization-table.component.html',
  styleUrls: ['./organization-table.component.css'],
})
export class OrganizationTableComponent implements OnInit {
  @ViewChild('organizationTable', { static: false }) table: any;
  @ViewChild('inactiveModal', {static: false})
  public inactiveModal: ModalDirective;

  page = new Page();
  idInactive: number = 0;
  path: string = '';
  rows: any = [];
  searchTerm: string = '';

  constructor(
    private adminOrganizationService: AdminOrganizationService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
  ) 
  { }

  ngOnInit() {
    this.path = this.activatedRoute.snapshot.data.title;
    this.getOrganizationByPage({offset: 0});
  }

  getOrganizationByPage(pageInfo: {offset: any}){
    this.page.pageNumber = pageInfo.offset + 1;
    this.getOrganization();
  }

  getOrganization(){
    this.adminOrganizationService.getOrganizations(this.page)
    .subscribe(data => {
      this.page.totalElements = data.totalElements;
      this.page.totalPages = data.totalPages;
      this.rows = data['content'];
    });
  }

  toggleExpandRow(row: any) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  openDeleteModal(row: any){
    this.idInactive = row.id;
    this.inactiveModal.show();
  }

  selectInactive(){
    this.adminOrganizationService.deleteOrganization(this.idInactive).subscribe(data =>{
      this.idInactive = 0;
      this.inactiveModal.hide();
      this.toastr.success(data.message, 'Delete Organization');
      this.getOrganization();
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
      this.getOrganization();
      return;
    }

    this.page.searchTerm = search;
    this.getOrganization();
  }

  onSort(event: any) {
    this.page.pageNumber = 1;
    this.page.sort = `${event.column.prop},${event.newValue}`;
    this.getOrganization();
  }
}


