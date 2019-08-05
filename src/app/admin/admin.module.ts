import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

// tables and forms
import { NgSelectModule } from '@ng-select/ng-select'
import { NgxDatatableModule } from '@swimlane/ngx-datatable'

import { AdminRoutingModule } from './admin-routing.module'

// admin menu component
import { MenuTableComponent } from './menu/menu-table/menu-table.component'
import { MenuFormComponent } from './menu/menu-form/menu-form.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    NgSelectModule,
    NgxDatatableModule,
  ],
  declarations: [MenuTableComponent, MenuFormComponent],
})
export class AdminModule {}
