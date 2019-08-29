import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AdminSharedModule } from "../shared/admin-shared.module";
import { OrganizationFormComponent } from "./form/organization-form.component";
import { OrganizationRoutingModule } from "./organization-routing.module";
import { OrganizationTableComponent } from "./table/organization-table.component";

@NgModule({
  declarations: [
    OrganizationTableComponent,
    OrganizationFormComponent
  ],
  imports: [
    CommonModule,
    OrganizationRoutingModule,
    AdminSharedModule
  ]
})
export class OrganizationModule {}
