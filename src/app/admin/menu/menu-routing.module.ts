import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuTableComponent } from './menu-table/menu-table.component'

import { MenuFormComponent } from './menu-form/menu-form.component'

const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        component: MenuTableComponent,
        data: {
          title: 'cms-menu'
        },
      },
      {
        path: 'add',
        component: MenuFormComponent,
        data: {
          title: 'add'
        }
      },
      {
        path: 'view/:id',
        component: MenuFormComponent,
        data: {
          title: 'view'
        }
      },
      {
        path: 'edit/:id',
        component: MenuFormComponent,
        data: {
          title: 'edit'
        }
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuRoutingModule { }
