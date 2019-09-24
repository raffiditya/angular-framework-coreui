import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { isFieldInvalid, normalizeFlag } from '../../../util';
import { RoleService } from '../../service/role.service';

@Component({
  templateUrl: './role-form.component.html',
})
export class RoleFormComponent implements OnInit {

  editable: boolean = false;
  form: FormGroup;
  id: number = 0;
  isFieldInvalid = isFieldInvalid;
  path: string = '';
  roleName: string = '';

  constructor(
    private router: Router,
    private roleService: RoleService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public location: Location,
    private toastr: ToastrService,
  ) {
    this.form = formBuilder.group({
      activeFlag: new FormControl(false, Validators.required),
      name: new FormControl('', Validators.required),
      description: new FormControl(null),
    });
  }

  ngOnInit() {
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('roleId'));
    this.path = this.activatedRoute.snapshot.data.title;
    this.editable = this.activatedRoute.snapshot.data.editable;

    if (this.id) {
      this.roleService.getRole(this.id).subscribe(data => {
        this.roleName = data.name;
        this.form.patchValue(data);

        this.form.get('activeFlag').setValue(data['activeFlag'] === 'Y');

        if (this.editable) {
          this.form.enable();
        } else {
          this.form.disable();
        }
      });
    }
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    if (this.id) {
      this.roleService
        .editRole(this.id, normalizeFlag(this.form))
        .subscribe(data => {
          this.router.navigate(['/admin/role'])
            .then(() => this.toastr.success(data.message, 'Edit Role'));
        });
    } else {
      this.roleService.addRole(normalizeFlag(this.form))
        .subscribe(data => {
          this.router.navigate(['/admin/role'])
            .then(() => this.toastr.success(data.message, 'Add Role'));
        });
    }
  }
}
