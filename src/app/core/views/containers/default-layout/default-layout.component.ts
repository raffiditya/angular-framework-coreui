import { Component, Inject, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
// import { navItems } from '../../_nav';
import { navItems } from '../../../../_new-nav';
import { AuthService } from "../../../services/auth.service";
import { Router } from "@angular/router";


@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnDestroy {
  public navItems = navItems;
  public sidebarMinimized = true;
  public element: HTMLElement;
  private changes: MutationObserver;

  constructor(private authService: AuthService, private router: Router, @Inject(DOCUMENT) _document?: any) {

    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = _document.body.classList.contains('sidebar-minimized');
    });
    this.element = _document.body;
    this.changes.observe(<Element>this.element, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  ngOnDestroy(): void {
    this.changes.disconnect();
  }

  onLogout() {
    this.authService.logout().subscribe(() => this.router.navigateByUrl('/login'));
  }
}
