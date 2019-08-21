import { Component, EventEmitter, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AdminRoleMenuService } from '../role-menu.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { normalizeFlag } from '../../../../shared/util/normalize-flag';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { Page } from '../../../../core/model/page';

@Component({
  templateUrl: './role-menu-form.component.html',
})
export class RoleMenuFormComponent implements OnInit {
  editable: boolean = false;
  roleId: number = 0;
  assignedMenuId: number = 0;
  path: string = '';
  role: any[] = [];
  menus: any[] = [];
  page: Page = new Page();
  menuTypeahead: EventEmitter<string> = new EventEmitter<string>();
  form: FormGroup;

  minDate = new Date(1960, 0, 0);
  maxDate = new Date();

  constructor(
    private router: Router,
    private adminRoleMenuService: AdminRoleMenuService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private toastr: ToastrService,
  ) {
    this.form = formBuilder.group({
      activeFlag: new FormControl(false, Validators.required),
      roleId: new FormControl(null, Validators.required),
      menuId: new FormControl(null, Validators.required),
      startDate: new FormControl(
        new Date().toISOString().slice(0, 10),
        Validators.required,
      ),
      endDate: new FormControl(new Date().toISOString().slice(0, 10)),
    });
  }

  ngOnInit() {
    this.roleId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.assignedMenuId = Number(
      this.activatedRoute.snapshot.paramMap.get('menuid'),
    );
    this.path = this.activatedRoute.snapshot.data.title;
    this.editable = this.path !== 'View';
    this.searchMenu();

    if (this.assignedMenuId === 0 && this.path === 'Add') {
      this.adminRoleMenuService.getRole(this.roleId).subscribe(data => {
        this.role = [data];
        this.form.get('roleId').patchValue(data.id);
        this.form.get('roleId').disable();
        this.form.get('endDate').patchValue('9999-12-31');
      });
    } else {
      this.adminRoleMenuService
        .getAssignedMenu(this.assignedMenuId)
        .subscribe(data => {
          this.form.patchValue(data);

          this.form.get('activeFlag').setValue(data['activeFlag'] === 'Y');
          this.role = [data['role']];
          this.form.get('roleId').patchValue(data['role'].id);
          this.menus = [data.menu];
          this.form.get('menuId').patchValue(data.menu.id);

          if (this.editable) {
            this.form.enable();
            this.form.get('roleId').disable();
          } else {
            this.form.disable();
          }
        });
    }
  }

  isFieldInvalid(field: string) {
    const fieldControl = this.form.get(field);
    return fieldControl.invalid && (fieldControl.dirty || fieldControl.touched);
  }

  searchMenu() {
    this.menus = [];

    this.menuTypeahead
      .pipe(
        filter(t => t && t.length >= 2),
        distinctUntilChanged(),
        debounceTime(300),
        switchMap(term => {
          return this.adminRoleMenuService.getMenus(this.page);
        }),
      )
      .subscribe(data => {
        this.menus = data['content'];
      });
  }

  cancelButton() {
    this.location.back();
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    this.form.get('roleId').enable();

    if (this.assignedMenuId === 0 && this.path === 'Add') {
      this.adminRoleMenuService
        .addAssignedMenu(normalizeFlag(this.form))
        .subscribe(data => {
          this.toastr.success(data.message, 'Assign Menu to Role');
          this.location.back();
        });
    } else {
      this.adminRoleMenuService
        .editAssignedMenu(this.assignedMenuId, normalizeFlag(this.form))
        .subscribe(data => {
          this.toastr.success(data.message, 'Edit Assign Menu to Role');
          this.location.back();
        });
    }
  }
}
