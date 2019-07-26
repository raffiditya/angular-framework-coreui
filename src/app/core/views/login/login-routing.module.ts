import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./login.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule {
}
