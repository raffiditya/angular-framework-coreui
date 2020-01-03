import { Location } from '@angular/common';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, filter, switchMap, tap } from 'rxjs/operators';
import { isFieldInvalid, normalizeFlag } from '../../../util';
import { Menu, Module } from '../../model';
import { MenuService, ModuleService } from '../../service';
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
  menus: Menu[] = [];
  moduleTypeahead: EventEmitter<string> = new EventEmitter<string>();
  modules: Module[] = [];
  title: string = '';

  constructor(
    private menuService: MenuService,
    private moduleService: ModuleService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public location: Location,
  ) {
    this.form = formBuilder.group({
      activeFlag: new FormControl(false, Validators.required),
      name: new FormControl('', Validators.required),
      moduleId: new FormControl(null),
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
    this.title = this.activatedRoute.snapshot.data.title;
    this.editable = this.activatedRoute.snapshot.data.editable;
    this.searchModule();
    this.searchMenu();

    if (!this.editable) {
      this.form.disable();
    }

    if (this.id) {
      this.menuService
        .get(this.id)
        .subscribe(data => {
          this.form.patchValue(data);

          this.form.get('activeFlag').setValue(data.activeFlag === 'Y');
          this.form.get('titleFlag').setValue(data.titleFlag === 'Y');
          if (data.parentId) {
            this.setParent(data.parentId);
          }
          if (data.moduleId) {
            this.setModule(data.moduleId);
          }
        });
    }
  }

  setParent(parentId: number) {
    this.menuService
      .get(parentId)
      .subscribe(data => this.menus = [data]);
  }

  setModule(moduleId: number) {
    this.moduleService
      .get(moduleId)
      .subscribe(data => this.modules = [data]);
  }

  searchMenu() {
    this.menuTypeahead
      .pipe(
        tap(() => this.menus = []),
        filter(t => t && t.length >= 2),
        debounceTime(300),
        switchMap(searchText => this.menuService.search(searchText))
      )
      .subscribe(data => this.menus = data);
  }

  searchModule() {
    this.moduleTypeahead
      .pipe(
        tap(() => this.modules = []),
        filter(t => t && t.length >= 2),
        debounceTime(300),
        switchMap(searchText => this.moduleService.search(searchText))
      )
      .subscribe(data => this.modules = data);
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    if (this.id) {
      this.menuService
        .edit(this.id, normalizeFlag(this.form))
        .subscribe(() => this.location.back());
    } else {
      this.menuService
        .add(normalizeFlag(this.form))
        .subscribe(() => this.location.back());
    }
  }
}
