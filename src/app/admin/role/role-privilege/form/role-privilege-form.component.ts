import { Component, EventEmitter, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AdminRolePrivilegeService } from '../role-privilege.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { normalizeFlag } from '../../../../shared/util/normalize-flag';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { Page } from '../../../../core/model/page';

@Component({
  templateUrl: './role-privilege-form.component.html',
})
export class RolePrivilegeFormComponent implements OnInit {
  editable: boolean = false;
  roleId: number = 0;
  assignedPrivilegeId: number = 0;
  path: string = '';
  role: any[] = [];
  privileges: any[] = [];
  page: Page = new Page();
  menuTypeahead: EventEmitter<string> = new EventEmitter<string>();
  form: FormGroup;

  constructor(
    private router: Router,
    private adminRolePrivilegeService: AdminRolePrivilegeService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private toastr: ToastrService,
  ) {
    this.form = formBuilder.group({
      activeFlag: new FormControl(false, Validators.required),
      roleId: new FormControl(null, Validators.required),
      privilegeId: new FormControl(null, Validators.required),
      canCreate: new FormControl(false, Validators.required),
      canRead: new FormControl(false, Validators.required),
      canUpdate: new FormControl(false, Validators.required),
      canDelete: new FormControl(false, Validators.required),
    });
  }

  ngOnInit() {
    this.roleId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.assignedPrivilegeId = Number(
      this.activatedRoute.snapshot.paramMap.get('privilegeid'),
    );
    this.path = this.activatedRoute.snapshot.data.title;
    this.editable = this.path !== 'View';
    this.searchPrivilege();

    if (this.assignedPrivilegeId === 0 && this.path === 'Add') {
      this.adminRolePrivilegeService.getRole(this.roleId).subscribe(data => {
        this.role = [data];
        this.form.get('roleId').patchValue(data.id);
        this.form.get('roleId').disable();
      });
    } else {
      this.adminRolePrivilegeService
        .getPrivilege(this.assignedPrivilegeId)
        .subscribe(data => {
          this.role = [data['role']];
          this.form.get('roleId').patchValue(data['role'].id);
          this.privileges = [data.privilege];
          this.form.get('privilegeId').patchValue(data['privilege'].id);

          this.form.get('canCreate').setValue(data['canCreate'] === 'Y');
          this.form.get('canRead').setValue(data['canRead'] === 'Y');
          this.form.get('canUpdate').setValue(data['canUpdate'] === 'Y');
          this.form.get('canDelete').setValue(data['canDelete'] === 'Y');

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

  searchPrivilege() {
    this.privileges = [];

    this.menuTypeahead
      .pipe(
        filter(t => t && t.length >= 2),
        distinctUntilChanged(),
        debounceTime(300),
        switchMap(term =>
          this.adminRolePrivilegeService.getPrivileges(this.page),
        ),
      )
      .subscribe(data => {
        this.privileges = data['content'];
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

    if (this.assignedPrivilegeId === 0 && this.path === 'Add') {
      this.adminRolePrivilegeService
        .addAssignedPrivilege(normalizeFlag(this.form))
        .subscribe(data => {
          this.toastr.success(data.message, 'Assign Privilege to Role');
          this.location.back();
        });
    } else {
      this.adminRolePrivilegeService
        .editAssignedPrivilege(
          this.assignedPrivilegeId,
          normalizeFlag(this.form),
        )
        .subscribe(data => {
          this.toastr.success(data.message, 'Assign Privilege to Role');
          this.location.back();
        });
    }
  }
}
