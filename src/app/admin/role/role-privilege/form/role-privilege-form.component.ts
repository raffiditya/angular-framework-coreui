import { Location } from '@angular/common';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, filter, switchMap, tap } from 'rxjs/operators';
import { Page } from '../../../../core/model/page.model';
import { isFieldInvalid, normalizeFlag } from '../../../../util';
import { PrivilegeService } from '../../../service/privilege.service';
import { RolePrivilegeService } from '../../../service/role-privilege.service';

@Component({
  templateUrl: './role-privilege-form.component.html',
})
export class RolePrivilegeFormComponent implements OnInit {

  editable: boolean = false;
  form: FormGroup;
  id: number;
  isFieldInvalid = isFieldInvalid;
  path: string = '';
  privilegeTypeahead: EventEmitter<string> = new EventEmitter<string>();
  privileges: any[] = [];
  roleId: number;

  constructor(
    private router: Router,
    private rolePrivilegeService: RolePrivilegeService,
    private privilegeService: PrivilegeService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public location: Location,
    private toastr: ToastrService,
  ) {
    this.form = formBuilder.group({
      roleId: new FormControl(null, Validators.required),
      privilegeId: new FormControl(null, Validators.required),
      canCreate: new FormControl(false, Validators.required),
      canRead: new FormControl(false, Validators.required),
      canUpdate: new FormControl(false, Validators.required),
      canDelete: new FormControl(false, Validators.required)
    });
  }

  ngOnInit() {
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('rolePrivilegeId'));
    this.roleId = Number(this.activatedRoute.snapshot.paramMap.get('roleId'));
    this.path = this.activatedRoute.snapshot.data.title;
    this.editable = this.activatedRoute.snapshot.data.editable;
    this.searchPrivilege();

    this.form.get('roleId').setValue(this.roleId);
    if (this.id) {
      this.rolePrivilegeService.getAssignedPrivilege(this.id)
        .subscribe(data => {
          this.form.get('privilegeId').setValue(data.privilege.id);
          this.form.get('canCreate').setValue(data['canCreate'] === 'Y');
          this.form.get('canRead').setValue(data['canRead'] === 'Y');
          this.form.get('canUpdate').setValue(data['canUpdate'] === 'Y');
          this.form.get('canDelete').setValue(data['canDelete'] === 'Y');

          this.privileges = [data.privilege];

          if (this.editable) {
            this.form.enable();
          } else {
            this.form.disable();
          }
        });
    }
  }

  searchPrivilege() {
    this.privilegeTypeahead
      .pipe(
        tap(() => this.privileges = []),
        filter(t => t && t.length >= 2),
        debounceTime(300),
        switchMap(searchTerm => {
          let page: Page = {
            size: 3,
            pageNumber: 1,
            searchTerm: searchTerm
          };

          return this.privilegeService.getPrivileges(page);
        }),
      )
      .subscribe(data => {
        this.privileges = data.content;
      });
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    if (this.id) {
      this.rolePrivilegeService.editAssignedPrivilege(this.id, normalizeFlag(this.form))
        .subscribe(data => {
          this.toastr.success(data.message, 'Edit Assign Privilege to Role');
          this.location.back();
        });
    } else {
      this.rolePrivilegeService.addAssignedPrivilege(normalizeFlag(this.form))
        .subscribe(data => {
          this.toastr.success(data.message, 'Add Assign Privilege to Role');
          this.location.back();
        });
    }
  }
}
