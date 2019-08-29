import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { EllipsisPipe } from "../../shared/pipe/ellipsis.pipe";
import { SearchTableComponent } from './search-table/search-table.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxDatatableModule,
    SweetAlert2Module
  ],
  declarations: [
    EllipsisPipe,
    SearchTableComponent
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxDatatableModule,
    SweetAlert2Module,
    SearchTableComponent,
    EllipsisPipe
  ]
})
export class AdminSharedModule {}
