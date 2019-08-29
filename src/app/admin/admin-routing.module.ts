import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Admin',
    },
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },
      {
        path: 'menu',
        loadChildren: () => import('./menu/menu.module').then(mod => mod.MenuModule)
      },
      {
        path: 'organization',
        loadChildren: () => import('./organization/organization.module').then(mod => mod.OrganizationModule)
      },
      {
        path: 'role',
        loadChildren: () => import('./role/role.module').then(mod => mod.RoleModule)
      },
      {
        path: 'user',
        loadChildren: () => import('./user/user.module').then(mod => mod.UserModule)
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
