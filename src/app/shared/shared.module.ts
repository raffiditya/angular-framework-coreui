import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EllipsisPipe } from './pipe/ellipsis.pipe';
import { SearchTableComponent } from './search-table/search-table.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    EllipsisPipe,
    SearchTableComponent
  ],
  exports: [
    EllipsisPipe,
    SearchTableComponent
  ]
})
export class SharedModule { }
