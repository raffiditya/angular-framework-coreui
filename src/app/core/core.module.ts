import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppBreadcrumbModule, AppFooterModule, AppHeaderModule, AppSidebarModule } from '@coreui/angular';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { BlockUIModule } from 'ng-block-ui';
import { BlockUIHttpModule } from 'ng-block-ui/http';
import { BsDatepickerModule, BsDropdownModule } from 'ngx-bootstrap';
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule, } from 'ngx-perfect-scrollbar';
import { ToastrModule } from 'ngx-toastr';
import { CoreRoutingModule } from './core-routing.module';
import {
  NotifierInterceptorService,
  ResponseInterceptorService,
  TokenInterceptorService
} from './services/http-interceptors';
import {
  BlockUiTemplateComponent,
  DefaultLayoutComponent,
  P403Component,
  P404Component,
  P500Component,
} from './views';

// noinspection JSUnusedLocalSymbols
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

const APP_CONTAINERS = [DefaultLayoutComponent];

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
      template: BlockUiTemplateComponent,
      delayStart: 500,
      delayStop: 500,
    }),
    BlockUIHttpModule.forRoot({
      blockAllRequestsInProgress: true
    }),
    LoadingBarRouterModule,
    ToastrModule.forRoot({
      timeOut: 7000,
      progressBar: true,
    }),
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    SweetAlert2Module.forRoot()
  ],
  declarations: [
    BlockUiTemplateComponent,
    ...APP_CONTAINERS,
    P403Component,
    P404Component,
    P500Component,
  ],
  entryComponents: [BlockUiTemplateComponent],
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
    BlockUIHttpModule,
    LoadingBarRouterModule,
    ToastrModule,
    BsDropdownModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ResponseInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NotifierInterceptorService,
      multi: true,
    },
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        `CoreModule has already been loaded. Import Core modules in the AppModule only.`,
      );
    }
  }
}
