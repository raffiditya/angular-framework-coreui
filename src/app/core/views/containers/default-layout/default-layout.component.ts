import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { INavData } from '@coreui/angular';
import { Module } from '../../../model/module.model';
import { AuthService, ModuleService, NavigationService, UserService } from '../../../services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit {

  public moduleItems: Module[] = [];
  public navItems: INavData[] = [];
  public selectedModule: Module;
  public sidebarMinimized = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private moduleService: ModuleService,
    private navigationService: NavigationService,
    private router: Router
  ) {
    this.selectedModule = moduleService.selectedModule;
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

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  ngOnInit(): void {
    // this.getMenu();
    this.getModule();
  }

  onSelectChanges(selectedItem: Module) {
    this.selectedModule = selectedItem;
    this.moduleService.selectedModule = selectedItem;
    this.getMenu(selectedItem);
  }

  getModule() {
    this.moduleService.getModule()
      .subscribe(
        moduleResponse => {
          this.moduleItems = moduleResponse;
          if (this.moduleItems !== null && this.moduleItems.length > 0) {
            if (this.selectedModule == null) {
              this.selectedModule = this.moduleItems[0];
              this.moduleService.selectedModule = this.selectedModule;
            }
            this.getMenu(this.selectedModule);
          }
        }
      );
  }

  getMenu(module: Module) {
    this.navigationService.getMenu(module.id)
      .subscribe(
        navsResponse => this.navItems = navsResponse
      );
  }

  onLogout(): void {
    this.authService.logout()
      .subscribe(() => this.router.navigateByUrl('/login'));
  }
}
