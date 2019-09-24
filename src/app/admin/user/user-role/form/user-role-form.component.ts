import { Location } from '@angular/common';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, filter, switchMap, tap } from 'rxjs/operators';
import { Page } from '../../../../core/model/page.model';
import { isFieldInvalid, normalizeFlag } from '../../../../util';
import { RoleService } from '../../../service/role.service';
import { UserRoleService } from '../../../service/user-role.service';

@Component({
  templateUrl: './user-role-form.component.html',
})
export class UserRoleFormComponent implements OnInit {

  currentDate = new Date();
  editable: boolean = false;
  form: FormGroup;
  id: number = 0;
  isFieldInvalid = isFieldInvalid;
  path: string = '';
  roleTypeahead: EventEmitter<string> = new EventEmitter<string>();
  roles: any[] = [];
  userId: number;

  constructor(
    private router: Router,
    private userRoleService: UserRoleService,
    private roleService: RoleService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public location: Location,
    private toastr: ToastrService,
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
    this.path = this.activatedRoute.snapshot.data.title;
    this.editable = this.activatedRoute.snapshot.data.editable;
    this.searchRole();

    this.form.get('userId').setValue(this.userId);
    if (this.id) {
      this.userRoleService.getAssignedRole(this.id)
        .subscribe(data => {
          this.form.patchValue(data);

          this.form.get('activeFlag').setValue(data['activeFlag'] === 'Y');
          this.form.get('roleId').patchValue(data.role.id);
          this.roles = [data.role];

          if (this.editable) {
            this.form.enable();
          } else {
            this.form.disable();
          }
        });
    }
  }

  searchRole() {
    this.roleTypeahead
      .pipe(
        tap(() => this.roles = []),
        filter(t => t && t.length >= 2),
        debounceTime(300),
        switchMap(searchTerm => {
          let page: Page = {
            size: 3,
            pageNumber: 1,
            searchTerm: searchTerm
          };

          return this.roleService.getRoles(page);
        }),
      )
      .subscribe(data => {
        this.roles = data.content;
      });
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    if (this.id) {
      this.userRoleService.editAssignedRole(this.id, normalizeFlag(this.form))
        .subscribe(data => {
          this.toastr.success(data.message, 'Edit Assign Role to User');
          this.location.back();
        });
    } else {
      this.userRoleService.addAssignedRole(normalizeFlag(this.form))
        .subscribe(data => {
          this.toastr.success(data.message, 'Add Assign Role to User');
          this.location.back();
        });
    }
  }
}
