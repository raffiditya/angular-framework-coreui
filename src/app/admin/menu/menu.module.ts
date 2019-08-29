import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AdminSharedModule } from "../shared/admin-shared.module";
import { MenuFormComponent } from "./form/menu-form.component";
import { MenuRoutingModule } from "./menu-routing.module";
import { MenuTableComponent } from "./table/menu-table.component";

@NgModule({
  declarations: [
    MenuFormComponent,
    MenuTableComponent
  ],
  imports: [
    CommonModule,
    MenuRoutingModule,
    AdminSharedModule
  ]
})
export class MenuModule {}
