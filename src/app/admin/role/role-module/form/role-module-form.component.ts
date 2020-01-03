import { Location } from '@angular/common';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { debounceTime, filter, switchMap, tap } from 'rxjs/operators';
import { isFieldInvalid, normalizeFlag } from '../../../../util';
import { Module } from '../../../model';
import { ModuleService, RoleModuleService } from '../../../service';

@Component({
  templateUrl: './role-module-form.component.html',
})
export class RoleModuleFormComponent implements OnInit {

  currentDate = new Date();
  editable: boolean = false;
  form: FormGroup;
  id: number = 0;
  isFieldInvalid = isFieldInvalid;
  menuTypeahead: EventEmitter<string> = new EventEmitter<string>();
  menus: Module[] = [];
  roleId: number;
  title: string = '';

  constructor(
    private roleModuleService: RoleModuleService,
    private moduleService: ModuleService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public location: Location,
  ) {
    this.form = formBuilder.group({
      roleId: new FormControl(null, Validators.required),
      moduleId: new FormControl(null, Validators.required),
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
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('roleModuleId'));
    this.roleId = Number(this.activatedRoute.snapshot.paramMap.get('roleId'));
    this.title = this.activatedRoute.snapshot.data.title;
    this.editable = this.activatedRoute.snapshot.data.editable;
    this.searchModule();
    this.form.get('roleId').setValue(this.roleId);

    if (!this.editable) {
      this.form.disable();
    }

    if (this.id) {
      this.roleModuleService
        .get(this.id)
        .subscribe(data => {
          this.form.patchValue(data);

          this.form.get('activeFlag').setValue(data.activeFlag === 'Y');
          this.form.get('moduleId').setValue(data.module.id);
          this.menus = [data.module];
        });
    }
  }

  searchModule() {
    this.menuTypeahead
      .pipe(
        tap(() => this.menus = []),
        filter(t => t && t.length >= 2),
        debounceTime(300),
        switchMap(searchText => this.moduleService.search(searchText))
      )
      .subscribe(data => this.menus = data);
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    if (this.id) {
      this.roleModuleService
        .edit(this.id, normalizeFlag(this.form))
        .subscribe(() => this.location.back());
    } else {
      this.roleModuleService
        .add(normalizeFlag(this.form))
        .subscribe(() => this.location.back());
    }
  }
}
