import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// tables and forms
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";

// cms menu routing
import { MenuRoutingModule } from './menu-routing.module'

// cms menu list
import { MenuTableComponent } from './menu-table/menu-table.component'

// cms menu form
import { MenuFormComponent } from './menu-form/menu-form.component'


@NgModule({
  declarations: [
    MenuTableComponent,
    MenuFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxDatatableModule,
    MenuRoutingModule
  ]
})

export class MenuModule {}
