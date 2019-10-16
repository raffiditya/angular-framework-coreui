import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavData } from '../../../../_nav';
import { AuthService, NavigationService, UserService } from '../../../services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit, OnDestroy {
  public element: HTMLElement;
  public navItems: NavData[] = [];
  public sidebarMinimized = true;
  private changes: MutationObserver;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private navigationService: NavigationService,
    private router: Router,
    @Inject(DOCUMENT) _document?: any
  ) {
    this.changes = new MutationObserver(() => {
      this.sidebarMinimized = _document.body.classList.contains('sidebar-minimized');
    });
    this.element = _document.body;
    this.changes.observe(<Element>this.element, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  get organizations() {
    return this.userService.organizationNameList;
  }

  get roles() {
    return this.userService.roleList;
  }

  get username() {
    return this.userService.username;
  }

  ngOnInit(): void {
    this.getMenu();
  }

  ngOnDestroy(): void {
    this.changes.disconnect();
  }

  getMenu() {
    this.navigationService.getMenu()
      .subscribe(
        navsResponse => this.navItems = navsResponse
      );
  }

  onLogout(): void {
    this.authService.logout()
      .subscribe(() => this.router.navigateByUrl('/login'));
  }
}
