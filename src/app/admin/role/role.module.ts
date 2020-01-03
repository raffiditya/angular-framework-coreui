import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { AdminSharedModule } from '../shared/admin-shared.module';
import { RoleFormComponent } from './form/role-form.component';
import { RoleMenuFormComponent } from './role-menu/form/role-menu-form.component';
import { RoleMenuTableComponent } from './role-menu/table/role-menu-table.component';
import { RoleModuleFormComponent } from './role-module/form/role-module-form.component';
import { RoleModuleTableComponent } from './role-module/table/role-module-table.component';
import { RolePrivilegeFormComponent } from './role-privilege/form/role-privilege-form.component';
import { RolePrivilegeTableComponent } from './role-privilege/table/role-privilege-table.component';
import { RoleRoutingModule } from './role-routing.module';
import { RoleTableComponent } from './table/role-table.component';

@NgModule({
  declarations: [
    RoleTableComponent,
    RoleFormComponent,
    RoleMenuTableComponent,
    RoleMenuFormComponent,
    RoleModuleTableComponent,
    RoleModuleFormComponent,
    RolePrivilegeTableComponent,
    RolePrivilegeFormComponent
  ],
  imports: [
    CommonModule,
    RoleRoutingModule,
    AdminSharedModule,
    BsDatepickerModule
  ]
})
export class RoleModule {}
