import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// tables and forms
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { AdminRoutingModule } from './admin-routing.module';

// table header
import { TableHeaderComponent } from './table-header/table-header.component';

// admin menu component
import { MenuTableComponent } from './menu/menu-table/menu-table.component';
import { MenuFormComponent } from './menu/menu-form/menu-form.component';

// admin organization component
import { OrganizationTableComponent } from './organization/organization-table/organization-table.component';
import { OrganizationFormComponent } from './organization/organization-form/organtization-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    NgSelectModule,
    NgxDatatableModule,
  ],
  declarations: [
    TableHeaderComponent,
    MenuTableComponent,
    MenuFormComponent,
    OrganizationTableComponent,
    OrganizationFormComponent,
  ],
})
export class AdminModule {}
