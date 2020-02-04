import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxDatatableModule,
    SweetAlert2Module, 
    SharedModule
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxDatatableModule,
    SweetAlert2Module,
    SharedModule
  ]
})
export class AdminSharedModule {}
