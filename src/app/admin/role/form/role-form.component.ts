import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AdminRoleService } from '../admin-role.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

@Component({
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.css'],
})
export class RoleFormComponent implements OnInit {
  id = 0;
  path = '';
  open = false;
  form: FormGroup;

  constructor(
    private router: Router,
    private adminRoleService: AdminRoleService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private _location: Location,
  ) {
    this.form = formBuilder.group({
      activeFlag: new FormControl(false, Validators.required),
      name: new FormControl('', Validators.required),
      description: new FormControl(null),
    });
  }

  ngOnInit() {
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.path = this.activatedRoute.snapshot.data.title;

    if (this.id) {
      this.adminRoleService.getRole(this.id).subscribe(data => {
        if (data['activeFlag'] === 'Y') {
          this.form.get('activeFlag').setValue(true);
        } else {
          this.form.get('activeFlag').setValue(false);
        }

        this.form.get('name').setValue(data['name']);
        this.form.get('description').setValue(data['description']);

        this.onSelectDisabled();
      });
    }
  }

  onDisabled() {
    if (this.path === 'View') {
      return true;
    } else {
      return false;
    }
  }

  onSelectDisabled() {
    let activeFlag = this.form.get('activeFlag');

    if (this.path === 'View') {
      activeFlag.disable();
    } else {
      activeFlag.enable();
    }
  }

  isFieldInvalid(field: string) {
    const fieldControl = this.form.get(field);
    return fieldControl.invalid && (fieldControl.dirty || fieldControl.touched);
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  cancelButton() {
    this._location.back();
  }

  onSubmit() {
    let activeFlagStatus = this.form.value.activeFlag;

    if (activeFlagStatus) {
      this.form.get('activeFlag').setValue('Y');
    } else {
      this.form.get('activeFlag').setValue('N');
    }

    this.validateAllFormFields(this.form);

    if (this.id) {
      if (this.form.valid) {
        this.adminRoleService
          .editRole(this.id, this.form.value)
          .subscribe(data => {
            this.router.navigate(['/admin/role']);
          });
      }
    } else {
      if (this.form.valid) {
        this.adminRoleService.addRole(this.form.value).subscribe(data => {
          this.router.navigate(['/admin/role']);
        });
      }
    }
  }
}
