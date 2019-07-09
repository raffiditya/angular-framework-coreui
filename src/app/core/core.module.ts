import {NgModule, Optional, SkipSelf} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {AppBreadcrumbModule, AppFooterModule, AppHeaderModule, AppSidebarModule} from "@coreui/angular";
import {HttpClientModule} from "@angular/common/http";
import {PerfectScrollbarConfigInterface, PerfectScrollbarModule} from "ngx-perfect-scrollbar";
import {BlockUIModule} from "ng-block-ui";
import {LoadingBarRouterModule} from "@ngx-loading-bar/router";
import {ToastrModule} from "ngx-toastr";
import {BsDropdownModule} from "ngx-bootstrap";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {BlockUiTemplateComponent, DefaultLayoutComponent, P403Component, P404Component, P500Component} from "./views";
import {CoreRoutingModule} from "./core-routing.module";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

const APP_CONTAINERS = [
  DefaultLayoutComponent
];

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    RouterModule,
    CoreRoutingModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    HttpClientModule,
    PerfectScrollbarModule,
    BlockUIModule.forRoot({
      message: 'Loading...',
      template: BlockUiTemplateComponent
    }),
    LoadingBarRouterModule,
    ToastrModule.forRoot({
      timeOut: 7000,
      progressBar: true
    }),
    BsDropdownModule.forRoot()
  ],
  declarations: [
    BlockUiTemplateComponent,
    ...APP_CONTAINERS,
    P403Component,
    P404Component,
    P500Component
  ],
  entryComponents: [
    BlockUiTemplateComponent
  ],
  exports: [
    CommonModule,
    BrowserAnimationsModule,
    RouterModule,
    AppBreadcrumbModule,
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    HttpClientModule,
    PerfectScrollbarModule,
    BlockUIModule,
    LoadingBarRouterModule,
    ToastrModule,
    BsDropdownModule
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(`CoreModule has already been loaded. Import Core modules in the AppModule only.`);
    }
  }
}
