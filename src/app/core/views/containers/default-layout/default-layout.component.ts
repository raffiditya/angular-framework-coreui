import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
// import { navItems } from '../../_nav';
import {NavData} from '../../../../_nav';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {NavigationService} from '../../../services/navigation.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit, OnDestroy {
  public navItems: NavData[] = [];
  public sidebarMinimized = true;
  public element: HTMLElement;
  private changes: MutationObserver;

  constructor(private authService: AuthService, private navigationService: NavigationService, private router: Router,
              @Inject(DOCUMENT) _document?: any) {
    this.changes = new MutationObserver(() => {
      this.sidebarMinimized = _document.body.classList.contains('sidebar-minimized');
    });
    this.element = _document.body;
    this.changes.observe(<Element>this.element, {
      attributes: true,
      attributeFilter: ['class']
    });
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
    this.authService.logout().subscribe(() => this.router.navigateByUrl('/login'));
  }
}
