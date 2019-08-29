import { Component, EventEmitter, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AdminUserRoleService } from '../user-role.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { normalizeFlag } from '../../../../shared/util/normalize-flag';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { Page } from '../../../../core/model/page';

@Component({
  templateUrl: './user-role-form.component.html',
})
export class UserRoleFormComponent implements OnInit {
  editable: boolean = false;
  userId: number = 0;
  assignedRoleId: number = 0;
  path: string = '';
  user: any[] = [];
  roles: any[] = [];
  page: Page = new Page();
  roleTypeahead: EventEmitter<string> = new EventEmitter<string>();
  form: FormGroup;

  minDate = new Date(1960, 0, 0);
  maxDate = new Date();
  minEndDate = new Date();
  // maxStartDate = new Date();

  constructor(
    private router: Router,
    private adminUserRoleService: AdminUserRoleService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private toastr: ToastrService,
  ) {
    this.form = formBuilder.group({
      activeFlag: new FormControl(false, Validators.required),
      userId: new FormControl(null, Validators.required),
      roleId: new FormControl(null, Validators.required),
      startDate: new FormControl(
        new Date().toISOString().slice(0, 10),
        Validators.required,
      ),
      endDate: new FormControl(new Date().toISOString().slice(0, 10)),
    });
  }

  ngOnInit() {
    this.userId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.assignedRoleId = Number(
      this.activatedRoute.snapshot.paramMap.get('roleid'),
    );
    this.path = this.activatedRoute.snapshot.data.title;
    this.editable = this.path !== 'View';
    this.searchRole();

    if (this.assignedRoleId === 0 && this.path === 'Add') {
      this.adminUserRoleService.getUser(this.userId).subscribe(data => {
        this.user = [data];
        this.form.get('userId').patchValue(data.id);
        this.form.get('userId').disable();
        this.form.get('endDate').patchValue('9999-12-31');
        this.checkStartDate();
      });
    } else {
      this.adminUserRoleService
        .getAssignedRole(this.assignedRoleId)
        .subscribe(data => {
          this.form.patchValue(data);

          this.form.get('activeFlag').setValue(data['activeFlag'] === 'Y');
          this.user = [data['user']];
          this.form.get('userId').patchValue(data['user'].id);
          this.roles = [data.role];
          this.form.get('roleId').patchValue(data.role.id);
          this.checkStartDate();

          if (this.editable) {
            this.form.enable();
            this.minEndDate = new Date(this.form.get('startDate').value());
            this.form.get('userId').disable();
          } else {
            this.form.disable();
          }
        });
    }
  }

  checkStartDate(){
    this.minEndDate = new Date(this.form.get('startDate').value);
  }

  isFieldInvalid(field: string) {
    const fieldControl = this.form.get(field);
    return fieldControl.invalid && (fieldControl.dirty || fieldControl.touched);
  }

  searchRole() {
    this.roles = [];

    this.roleTypeahead
      .pipe(
        filter(t => t && t.length >= 2),
        distinctUntilChanged(),
        debounceTime(300),
        switchMap(term => {
          return this.adminUserRoleService.getRoles(this.page);
        }),
      )
      .subscribe(data => {
        this.roles = data['content'];
      });
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    this.form.get('userId').enable();

    if (this.assignedRoleId === 0 && this.path === 'Add') {
      this.adminUserRoleService
        .addAssignedRole(normalizeFlag(this.form))
        .subscribe(data => {
          this.toastr.success(data.message, 'Assign User to Role');
          this.location.back();
        });
    } else {
      this.adminUserRoleService
        .editAssignedRole(this.assignedRoleId, normalizeFlag(this.form))
        .subscribe(data => {
          this.toastr.success(data.message, 'Edit Assign User to Role');
          this.location.back();
        });
    }
  }
}
