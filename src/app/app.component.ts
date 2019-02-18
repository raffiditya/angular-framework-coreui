import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LoadingBarService } from "@ngx-loading-bar/core";
import { delay, map, withLatestFrom } from "rxjs/operators";

@Component({
  selector: 'body',
  template: `
    <block-ui [name]="'appRoot'">
      <router-outlet></router-outlet>
    </block-ui>
    <ngx-loading-bar [value]="(delayedProgress$|async) || 0" [color]="'#ff843a'" [includeSpinner]="false"></ngx-loading-bar>
  `
})
export class AppComponent implements OnInit {

  delayedProgress$ = this.loader.progress$.pipe(
    delay(500),
    withLatestFrom(this.loader.progress$),
    map(v => v[1])
  );

  constructor(
    private router: Router,
    private loader: LoadingBarService) {
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
