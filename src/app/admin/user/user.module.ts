import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BsDatepickerModule } from "ngx-bootstrap";
import { AdminSharedModule } from "../shared/admin-shared.module";
import { UserFormComponent } from "./form/user-form.component";
import { UserTableComponent } from "./table/user-table.component";
import { UserOrganizationFormComponent } from "./user-organization/form/user-organization-form.component";
import { UserOrganizationTableComponent } from "./user-organization/table/user-organization-table.component";
import { UserRoleFormComponent } from "./user-role/form/user-role-form.component";
import { UserRoleTableComponent } from "./user-role/table/user-role-table.component";
import { UserRoutingModule } from "./user-routing.module";

@NgModule({
  declarations: [
    UserFormComponent,
    UserTableComponent,
    UserRoleTableComponent,
    UserRoleFormComponent,
    UserOrganizationTableComponent,
    UserOrganizationFormComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    AdminSharedModule,
    BsDatepickerModule
  ]
})
export class UserModule {}
