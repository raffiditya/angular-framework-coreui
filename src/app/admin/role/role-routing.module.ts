import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleFormComponent } from './form/role-form.component';
import { RoleMenuFormComponent } from './role-menu/form/role-menu-form.component';
import { RoleModuleFormComponent } from './role-module/form/role-module-form.component';
import { RolePrivilegeFormComponent } from './role-privilege/form/role-privilege-form.component';
import { RoleTableComponent } from './table/role-table.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Role',
    },
    children: [
      {
        path: '',
        component: RoleTableComponent,
        data: {
          title: 'Table',
        }
      },
      {
        path: 'add',
        component: RoleFormComponent,
        data: {
          title: 'Add',
          editable: true
        }
      },
      {
        path: ':roleId',
        children: [
          {
            path: '',
            component: RoleFormComponent,
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
                  title: 'Edit Role'
                },
                children: [
                  {
                    path: '',
                    component: RoleFormComponent,
                    data: {
                      editable: true,
                      title: 'Form'
                    }
                  },
                  {
                    path: 'role-module/add',
                    component: RoleModuleFormComponent,
                    data: {
                      title: 'Add Assigned Module',
                      editable: true
                    }
                  },
                  {
                    path: 'role-module/:roleModuleId',
                    children: [
                      {
                        path: '',
                        component: RoleModuleFormComponent,
                        data: {
                          title: 'Detail Assigned Module',
                          editable: false
                        }
                      },
                      {
                        path: 'edit',
                        component: RoleModuleFormComponent,
                        data: {
                          title: 'Edit Assigned Module',
                          editable: true
                        }
                      }
                    ]
                  },
                  {
                    path: 'role-menu/add',
                    component: RoleMenuFormComponent,
                    data: {
                      title: 'Add Assigned Menu',
                      editable: true
                    }
                  },
                  {
                    path: 'role-menu/:roleMenuId',
                    children: [
                      {
                        path: '',
                        component: RoleMenuFormComponent,
                        data: {
                          title: 'Detail Assigned Menu',
                          editable: false
                        }
                      },
                      {
                        path: 'edit',
                        component: RoleMenuFormComponent,
                        data: {
                          title: 'Edit Assigned Menu',
                          editable: true
                        }
                      }
                    ]
                  },
                  {
                    path: 'role-privilege/add',
                    component: RolePrivilegeFormComponent,
                    data: {
                      title: 'Add Assigned Privilege',
                      editable: true
                    }
                  },
                  {
                    path: 'role-privilege/:rolePrivilegeId',
                    children: [
                      {
                        path: '',
                        component: RolePrivilegeFormComponent,
                        data: {
                          title: 'Detail Assigned Privilege',
                          editable: false
                        }
                      },
                      {
                        path: 'edit',
                        component: RolePrivilegeFormComponent,
                        data: {
                          title: 'Edit Assigned Privilege',
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
export class RoleRoutingModule {}
