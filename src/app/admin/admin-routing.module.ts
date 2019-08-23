import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// admin menu component
import { MenuTableComponent } from './menu/table/menu-table.component';
import { MenuFormComponent } from './menu/form/menu-form.component';

// admin organization component
import { OrganizationTableComponent } from './organization/organization-table/organization-table.component';
import { OrganizationFormComponent } from './organization/organization-form/organtization-form.component';

// admin role component
import { RoleTableComponent } from './role/table/role-table.component';
import { RoleFormComponent } from './role/form/role-form.component';

// role menu assignment
import { RoleMenuTableComponent } from './role/role-menu/table/role-menu-table.component';
import { RoleMenuFormComponent } from './role/role-menu/form/role-menu-form.component';

// role privilege assignment
import { RolePrivilegeTableComponent } from './role/role-privilege/table/role-privilege-table.component';
import { RolePrivilegeFormComponent } from './role/role-privilege/form/role-privilege-form.component';

// admin user component
import { UserTableComponent } from './user/user-table/user-table.component';
import { UserFormComponent } from './user/user-form/user-form.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Admin',
    },
    children: [
      // {
      //   path: '',
      //   redirectTo: 'menu',
      // },
      {
        path: 'menu',
        children: [
          {
            path: '',
            component: MenuTableComponent,
            pathMatch: 'full',
            data: {
              title: 'Menu',
            },
          },
          {
            path: 'add',
            component: MenuFormComponent,
            pathMatch: 'full',
            data: {
              title: 'Add',
            },
          },
          {
            path: ':id',
            component: MenuFormComponent,
            pathMatch: 'full',
            data: {
              title: 'View',
            },
          },
          {
            path: 'edit/:id',
            component: MenuFormComponent,
            pathMatch: 'full',
            data: {
              title: 'Edit',
            },
          },
        ],
      },
      {
        path: 'organizations',
        children: [
          {
            path: '',
            component: OrganizationTableComponent,
            pathMatch: 'full',
            data: {
              title: 'Organizations',
            },
          },
          {
            path: 'add',
            component: OrganizationFormComponent,
            pathMatch: 'full',
            data: {
              title: 'Add',
            },
          },
          {
            path: ':id',
            component: OrganizationFormComponent,
            pathMatch: 'full',
            data: {
              title: 'View',
            },
          },
          {
            path: 'edit/:id',
            component: OrganizationFormComponent,
            pathMatch: 'full',
            data: {
              title: 'Edit',
            },
          },
        ],
      },
      {
        path: 'user',
        children: [
          {
            path: '',
            component: UserTableComponent,
            pathMatch: 'full',
            data: {
              title: 'Users',
            },
          },
          {
            path: 'add',
            component: UserFormComponent,
            pathMatch: 'full',
            data: {
              title: 'Add',
            },
          },
          {
            path: 'view/:id',
            component: UserFormComponent,
            pathMatch: 'full',
            data: {
              title: 'View',
            },
          },
          {
            path: 'edit/:id',
            component: UserFormComponent,
            pathMatch: 'full',
            data: {
              title: 'Edit',
            },
          },
        ],
      },
      {
        path: 'role',
        children: [
          {
            path: '',
            component: RoleTableComponent,
            pathMatch: 'full',
            data: {
              title: 'Role',
            },
          },
          {
            path: 'add',
            component: RoleFormComponent,
            pathMatch: 'full',
            data: {
              title: 'Add',
            },
          },
          {
            path: ':id',
            component: RoleFormComponent,
            pathMatch: 'full',
            data: {
              title: 'View',
            },
          },
          {
            path: 'edit/:id',
            children: [
              {
                path: '',
                component: RoleFormComponent,
                pathMatch: 'full',
                data: {
                  title: 'Edit',
                },
              },
              {
                path: 'add-assigned-menu',
                component: RoleMenuFormComponent,
                pathMatch: 'full',
                data: {
                  title: 'Add',
                },
              },
              {
                path: 'view-assigned-menu/:menuid',
                component: RoleMenuFormComponent,
                pathMatch: 'full',
                data: {
                  title: 'View',
                },
              },
              {
                path: 'edit-assigned-menu/:menuid',
                component: RoleMenuFormComponent,
                pathMatch: 'full',
                data: {
                  title: 'Edit',
                },
              },
              {
                path: 'add-assigned-privilege',
                component: RolePrivilegeFormComponent,
                pathMatch: 'full',
                data: {
                  title: 'Add',
                },
              },
              {
                path: 'view-assigned-privilege/:privilegeid',
                component: RolePrivilegeFormComponent,
                pathMatch: 'full',
                data: {
                  title: 'View',
                },
              },
              {
                path: 'edit-assigned-privilege/:privilegeid',
                component: RolePrivilegeFormComponent,
                pathMatch: 'full',
                data: {
                  title: 'Edit',
                },
              },
            ],
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
