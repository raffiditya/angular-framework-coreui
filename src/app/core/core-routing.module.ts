import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultLayoutComponent, P403Component, P404Component, P500Component } from "./views";
import { AuthGuard } from "./guard/auth.guard";

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
      title: 'Page 403'
    }
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    loadChildren: './views/login/login.module#LoginModule'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: 'app/dashboard/dashboard.module#DashboardModule'
      }
    ]
  },
  {path: '**', component: P404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule {
}
