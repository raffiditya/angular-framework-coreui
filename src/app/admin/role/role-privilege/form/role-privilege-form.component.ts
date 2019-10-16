import { Location } from '@angular/common';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, filter, switchMap, tap } from 'rxjs/operators';
import { isFieldInvalid, normalizeFlag } from '../../../../util';
import { Privilege } from '../../../model';
import { PrivilegeService, RolePrivilegeService } from '../../../service';

@Component({
  templateUrl: './role-privilege-form.component.html',
})
export class RolePrivilegeFormComponent implements OnInit {

  editable: boolean = false;
  form: FormGroup;
  id: number;
  isFieldInvalid = isFieldInvalid;
  privilegeTypeahead: EventEmitter<string> = new EventEmitter<string>();
  privileges: Privilege[] = [];
  roleId: number;
  title: string = '';

  constructor(
    private rolePrivilegeService: RolePrivilegeService,
    private privilegeService: PrivilegeService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public location: Location
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
    this.title = this.activatedRoute.snapshot.data.title;
    this.editable = this.activatedRoute.snapshot.data.editable;
    this.searchPrivilege();
    this.form.get('roleId').setValue(this.roleId);

    if (!this.editable) {
      this.form.disable();
    }

    if (this.id) {
      this.rolePrivilegeService
        .get(this.id)
        .subscribe(data => {
          this.form.get('privilegeId').setValue(data.privilege.id);
          this.form.get('canCreate').setValue(data.canCreate === 'Y');
          this.form.get('canRead').setValue(data.canRead === 'Y');
          this.form.get('canUpdate').setValue(data.canUpdate === 'Y');
          this.form.get('canDelete').setValue(data.canDelete === 'Y');

          this.privileges = [data.privilege];
        });
    }
  }

  searchPrivilege() {
    this.privilegeTypeahead
      .pipe(
        tap(() => this.privileges = []),
        filter(t => t && t.length >= 2),
        debounceTime(300),
        switchMap(searchText => this.privilegeService.search(searchText)),
      )
      .subscribe(data => this.privileges = data);
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    if (this.id) {
      this.rolePrivilegeService
        .edit(this.id, normalizeFlag(this.form))
        .subscribe(() => this.location.back());
    } else {
      this.rolePrivilegeService
        .add(normalizeFlag(this.form))
        .subscribe(() => this.location.back());
    }
  }
}
