import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Pipe } from '@angular/core';

// tables and forms
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { AdminRoutingModule } from './admin-routing.module';

import { ModalModule } from 'ngx-bootstrap/modal';

// Form NG Component
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

// admin menu component
import { MenuTableComponent } from './menu/table/menu-table.component';
import { MenuFormComponent } from './menu/form/menu-form.component';

// admin organization component
import { OrganizationTableComponent } from './organization/table/organization-table.component';
import { OrganizationFormComponent} from './organization/form/organization-form.component'

// admin role component
import { RoleTableComponent } from './role/table/role-table.component';
import { RoleFormComponent } from './role/form/role-form.component';

// role menu assignment
import { RoleMenuTableComponent } from './role/role-menu/table/role-menu-table.component';
import { RoleMenuFormComponent } from './role/role-menu/form/role-menu-form.component';

// role privilege assignment
import { RolePrivilegeTableComponent } from './role/role-privilege/table/role-privilege-table.component';
import { RolePrivilegeFormComponent } from './role/role-privilege/form/role-privilege-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    NgSelectModule,
    NgxDatatableModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
  ],
  declarations: [
    MenuTableComponent,
    MenuFormComponent,
    OrganizationTableComponent,
    OrganizationFormComponent,
    RoleTableComponent,
    RoleFormComponent,
    RoleMenuTableComponent,
    RoleMenuFormComponent,
    RolePrivilegeTableComponent,
    RolePrivilegeFormComponent,
  ],
})
export class AdminModule { }
