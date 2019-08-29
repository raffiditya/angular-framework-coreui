import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UserFormComponent } from "./form/user-form.component";
import { UserTableComponent } from "./table/user-table.component";
import { UserOrganizationFormComponent } from "./user-organization/form/user-organization-form.component";
import { UserRoleFormComponent } from "./user-role/form/user-role-form.component";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'User',
    },
    children: [
      {
        path: '',
        component: UserTableComponent,
        data: {
          title: 'Table',
        }
      },
      {
        path: 'add',
        component: UserFormComponent,
        data: {
          title: 'Add',
          editable: true
        }
      },
      {
        path: ':userId',
        children: [
          {
            path: '',
            component: UserFormComponent,
            data: {
              title: 'Detail',
              editable: false
            }
          },
          {
            path: 'edit',
            children: [
              {
                path: '',
                data: {
                  title: 'Edit User'
                },
                children: [
                  {
                    path: '',
                    component: UserFormComponent,
                    data: {
                      editable: true,
                      title: 'Form'
                    }
                  },
                  {
                    path: 'user-role/add',
                    component: UserRoleFormComponent,
                    data: {
                      title: 'Add Assigned Role',
                      editable: true
                    }
                  },
                  {
                    path: 'user-role/:userRoleId',
                    children: [
                      {
                        path: '',
                        component: UserRoleFormComponent,
                        data: {
                          title: 'Detail Assigned Role',
                          editable: false
                        }
                      },
                      {
                        path: 'edit',
                        component: UserRoleFormComponent,
                        data: {
                          title: 'Edit Assigned Role',
                          editable: true
                        }
                      }
                    ]
                  },
                  {
                    path: 'user-org/add',
                    component: UserOrganizationFormComponent,
                    data: {
                      title: 'Add Assigned Organization',
                      editable: true
                    }
                  },
                  {
                    path: 'user-org/:userOrgId',
                    children: [
                      {
                        path: '',
                        component: UserOrganizationFormComponent,
                        data: {
                          title: 'Detail Assigned Organization',
                          editable: false
                        }
                      },
                      {
                        path: 'edit',
                        component: UserOrganizationFormComponent,
                        data: {
                          title: 'Edit Assigned Organization',
                          editable: true
                        }
                      }
                    ]
                  }
                ]
              },
            ]
          },
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
