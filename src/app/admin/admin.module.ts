import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Pipe } from '@angular/core';

// tables and forms
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { AdminRoutingModule } from './admin-routing.module';

import { ModalModule } from 'ngx-bootstrap/modal';

// admin menu component
import { MenuTableComponent } from './menu/table/menu-table.component';
import { MenuFormComponent } from './menu/form/menu-form.component';

// admin organization component
import { OrganizationTableComponent } from './organization/organization-table/organization-table.component';
import { OrganizationFormComponent } from './organization/organization-form/organtization-form.component';

// admin role component
import { RoleTableComponent } from './role/table/role-table.component';
import { RoleFormComponent } from './role/form/role-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    NgSelectModule,
    NgxDatatableModule,
    ModalModule.forRoot(),
  ],
  declarations: [
    MenuTableComponent,
    MenuFormComponent,
    OrganizationTableComponent,
    OrganizationFormComponent,
    RoleTableComponent,
    RoleFormComponent,
  ],
})
export class AdminModule {}
