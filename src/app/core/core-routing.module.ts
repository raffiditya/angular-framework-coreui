import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { DefaultLayoutComponent, P403Component, P404Component, P500Component, } from './views';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '403',
    component: P403Component,
    data: {
      title: 'PageModel 403',
    },
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'PageModel 404',
    },
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'PageModel 500',
    },
  },
  {
    path: 'login',
    loadChildren: () => import('./views/login/login.module').then(mod => mod.LoginModule)
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home',
    },
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('../dashboard/dashboard.module').then(mod => mod.DashboardModule)
      },
      {
        path: 'admin',
        loadChildren: () => import('../admin/admin.module').then(mod => mod.AdminModule),
      }
    ]
  },
  { path: '**', component: P404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
