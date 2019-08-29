import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MenuTableComponent } from "./table/menu-table.component";
import { MenuFormComponent } from "./form/menu-form.component";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Menu',
    },
    children: [
      {
        path: '',
        component: MenuTableComponent,
        data: {
          title: 'Table',
        }
      },
      {
        path: 'add',
        component: MenuFormComponent,
        data: {
          title: 'Add',
          editable: true
        }
      },
      {
        path: ':id',
        children: [
          {
            path: '',
            component: MenuFormComponent,
            data: {
              title: 'Detail',
              editable: false
            }
          },
          {
            path: 'edit',
            component: MenuFormComponent,
            data: {
              title: 'Edit',
              editable: true
            }
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuRoutingModule {
}
