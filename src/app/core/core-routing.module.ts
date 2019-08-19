import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DefaultLayoutComponent, P403Component, P404Component, P500Component,} from './views';
import {AuthGuard} from './guard/auth.guard';

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
      title: 'Page 403',
    },
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404',
    },
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500',
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
      },
      {
        path: 'base',
        loadChildren: () => import('../views/base/base.module').then(mod => mod.BaseModule),
      },
      {
        path: 'buttons',
        loadChildren: () => import('../views/buttons/buttons.module').then(mod => mod.ButtonsModule),
      },
      {
        path: 'charts',
        loadChildren: () => import('../views/chartjs/chartjs.module').then(mod => mod.ChartJSModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('../views/dashboard/dashboard.module').then(mod => mod.DashboardModule)
      },
      {
        path: 'icons',
        loadChildren: () => import('../views/icons/icons.module').then(mod => mod.IconsModule)
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('../views/notifications/notifications.module').then(
            mod => mod.NotificationsModule,
          ),
      },
      {
        path: 'theme',
        loadChildren: () => import('../views/theme/theme.module').then(mod => mod.ThemeModule)
      },
      {
        path: 'widgets',
        loadChildren: () => import('../views/widgets/widgets.module').then(mod => mod.WidgetsModule)
      },
    ],
  },
  {path: '**', component: P404Component},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {
}
