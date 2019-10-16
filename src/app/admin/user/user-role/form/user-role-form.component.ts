import { Location } from '@angular/common';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { debounceTime, filter, switchMap, tap } from 'rxjs/operators';
import { isFieldInvalid, normalizeFlag } from '../../../../util';
import { Role } from '../../../model';
import { RoleService, UserRoleService } from '../../../service';

@Component({
  templateUrl: './user-role-form.component.html',
})
export class UserRoleFormComponent implements OnInit {

  currentDate = new Date();
  editable: boolean = false;
  form: FormGroup;
  id: number = 0;
  isFieldInvalid = isFieldInvalid;
  roleTypeahead: EventEmitter<string> = new EventEmitter<string>();
  roles: Role[] = [];
  title: string = '';
  userId: number;

  constructor(
    private userRoleService: UserRoleService,
    private roleService: RoleService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public location: Location
  ) {
    this.form = formBuilder.group({
      userId: new FormControl(null, Validators.required),
      roleId: new FormControl(null, Validators.required),
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
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('userRoleId'));
    this.userId = Number(this.activatedRoute.snapshot.paramMap.get('userId'));
    this.title = this.activatedRoute.snapshot.data.title;
    this.editable = this.activatedRoute.snapshot.data.editable;
    this.searchRole();
    this.form.get('userId').setValue(this.userId);

    if (!this.editable) {
      this.form.disable();
    }

    if (this.id) {
      this.userRoleService
        .get(this.id)
        .subscribe(data => {
          this.form.patchValue(data);

          this.form.get('activeFlag').setValue(data.activeFlag === 'Y');
          this.form.get('roleId').patchValue(data.role.id);
          this.roles = [data.role];
        });
    }
  }

  searchRole() {
    this.roleTypeahead
      .pipe(
        tap(() => this.roles = []),
        filter(t => t && t.length >= 2),
        debounceTime(300),
        switchMap(searchText => this.roleService.search(searchText)),
      )
      .subscribe(data => this.roles = data);
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    if (this.id) {
      this.userRoleService
        .edit(this.id, normalizeFlag(this.form))
        .subscribe(() => this.location.back());
    } else {
      this.userRoleService
        .add(normalizeFlag(this.form))
        .subscribe(() => this.location.back());
    }
  }
}
