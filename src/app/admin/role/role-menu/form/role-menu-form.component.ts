import { Location } from '@angular/common';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, filter, switchMap, tap } from 'rxjs/operators';
import { Page } from '../../../../core/model/page.model';
import { isFieldInvalid, normalizeFlag } from '../../../../util';
import { MenuService } from '../../../service/menu.service';
import { RoleMenuService } from '../../../service/role-menu.service';

@Component({
  templateUrl: './role-menu-form.component.html',
})
export class RoleMenuFormComponent implements OnInit {

  currentDate = new Date();
  editable: boolean = false;
  form: FormGroup;
  id: number = 0;
  isFieldInvalid = isFieldInvalid;
  menuTypeahead: EventEmitter<string> = new EventEmitter<string>();
  menus: any[] = [];
  path: string = '';
  roleId: number;

  constructor(
    private router: Router,
    private roleMenuService: RoleMenuService,
    private menuService: MenuService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public location: Location,
    private toastr: ToastrService,
  ) {
    this.form = formBuilder.group({
      roleId: new FormControl(null, Validators.required),
      menuId: new FormControl(null, Validators.required),
      startDate: new FormControl(
        moment().format('YYYY-MM-DD'),
        Validators.required,
      ),
      endDate: new FormControl(
        moment('9999-12-31').format('YYYY-MM-DD'),
        Validators.required,
      ),
      activeFlag: new FormControl(false, Validators.required)
    });
  }

  ngOnInit() {
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('roleMenuId'));
    this.roleId = Number(this.activatedRoute.snapshot.paramMap.get('roleId'));
    this.path = this.activatedRoute.snapshot.data.title;
    this.editable = this.activatedRoute.snapshot.data.editable;
    this.searchMenu();

    this.form.get('roleId').setValue(this.roleId);
    if (this.id) {
      this.roleMenuService.getAssignedMenu(this.id)
        .subscribe(data => {
          this.form.patchValue(data);

          this.form.get('activeFlag').setValue(data['activeFlag'] === 'Y');
          this.form.get('menuId').setValue(data.menu.id);
          this.menus = [data.menu];

          if (this.editable) {
            this.form.enable();
          } else {
            this.form.disable();
          }
        });
    }
  }

  searchMenu() {
    this.menuTypeahead
      .pipe(
        tap(() => this.menus = []),
        filter(t => t && t.length >= 2),
        debounceTime(300),
        switchMap(searchTerm => {
          let page: Page = {
            size: 3,
            pageNumber: 1,
            searchTerm: searchTerm
          };

          return this.menuService.getMenus(page);
        }),
      )
      .subscribe(data => {
        this.menus = data.content;
      });
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    if (this.id) {
      this.roleMenuService.editAssignedMenu(this.id, normalizeFlag(this.form))
        .subscribe(data => {
          this.toastr.success(data.message, 'Edit Assign Menu to Role');
          this.location.back();
        });
    } else {
      this.roleMenuService.addAssignedMenu(normalizeFlag(this.form))
        .subscribe(data => {
          this.toastr.success(data.message, 'Add Assign Menu to Role');
          this.location.back();
        });
    }
  }
}
