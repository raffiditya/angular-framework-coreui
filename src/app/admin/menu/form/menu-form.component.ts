import { Location } from '@angular/common';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, filter, switchMap, tap } from 'rxjs/operators';
import { Page } from '../../../core/model/page.model';
import { isFieldInvalid, normalizeFlag } from '../../../util';
import { MenuService } from '../../service/menu.service';
import { icons, MenuIconModel } from '../menu-icon.model';

@Component({
  templateUrl: './menu-form.component.html',
})
export class MenuFormComponent implements OnInit {

  editable: boolean = false;
  form: FormGroup;
  icons: MenuIconModel[];
  id: number = 0;
  isFieldInvalid = isFieldInvalid;
  menuTypeahead: EventEmitter<string> = new EventEmitter<string>();
  menus: any[] = [];
  path: string = '';

  constructor(
    private router: Router,
    private menuService: MenuService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public location: Location,
    private toastr: ToastrService,
  ) {
    this.form = formBuilder.group({
      activeFlag: new FormControl(false, Validators.required),
      name: new FormControl('', Validators.required),
      description: new FormControl(null),
      url: new FormControl(''),
      icon: new FormControl(''),
      orderNo: new FormControl(0),
      titleFlag: new FormControl(false),
      parentId: new FormControl(null),
    });
    this.icons = icons;
  }

  ngOnInit() {
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.path = this.activatedRoute.snapshot.data.title;
    this.editable = this.activatedRoute.snapshot.data.editable;
    this.searchMenu();

    if (this.id) {
      this.menuService
        .getMenu(this.id)
        .subscribe(data => {
          this.form.patchValue(data);

          this.form.get('activeFlag').setValue(data['activeFlag'] === 'Y');
          this.form.get('titleFlag').setValue(data['titleFlag'] === 'Y');
          if (data.parentId) {
            this.setParent(data.parentId);
          }

          if (this.editable) {
            this.form.enable();
          } else {
            this.form.disable();
          }
        });
    }
  }

  setParent(parentId: number) {
    this.menuService
      .getMenu(parentId)
      .subscribe(data => this.menus = [data]);
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
      this.menuService
        .editMenu(this.id, normalizeFlag(this.form))
        .subscribe(data => {
          this.router.navigate(['/admin/menu'])
            .then(() => this.toastr.success(data.message, 'Edit Menu'));
        });
    } else {
      this.menuService
        .addMenu(normalizeFlag(this.form))
        .subscribe(data => {
          this.router.navigate(['/admin/menu'])
            .then(() => this.toastr.success(data.message, 'Add Menu'));
        });
    }
  }
}
