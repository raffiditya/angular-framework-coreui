import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OrganizationFormComponent } from "./form/organization-form.component";
import { OrganizationTableComponent } from "./table/organization-table.component";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Organization',
    },
    children: [
      {
        path: '',
        component: OrganizationTableComponent,
        data: {
          title: 'Table',
        }
      },
      {
        path: 'add',
        component: OrganizationFormComponent,
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
            component: OrganizationFormComponent,
            data: {
              title: 'Detail',
              editable: false
            }
          },
          {
            path: 'edit',
            component: OrganizationFormComponent,
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
export class OrganizationRoutingModule {}
