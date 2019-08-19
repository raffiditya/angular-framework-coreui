import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { AdminUsersService } from '../admin-user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

@Component({
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent implements OnInit {
  id = 0;
  path = '';
  userData = null;
  form: FormGroup;
  selectAuthProvider = [
    { value: 'LDAP', name: 'LDAP' },
    { value: 'LOCAL', name: 'LOCAL' },
  ];

  constructor(
    private router: Router,
    private adminUserService: AdminUsersService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
  ) {
    this.form = formBuilder.group({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      authProvider: new FormControl('', Validators.required),
      description: new FormControl(null),
      activeFlag: new FormControl(false, Validators.required),
      locked: new FormControl(false, Validators.required),
    });
  }

  ngOnInit() {
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.path = this.activatedRoute.snapshot.data.title;
    if (this.id) {
      this.adminUserService.getUser(this.id).subscribe(data => {
        this.form.get('username').setValue(data.username);
        this.form.get('password').setValue(data.password);
        this.form.get('authProvider').setValue(data.authProvider);
        this.form.get('description').setValue(data.description);
        if (data.activeFlag === 'Y') {
          this.form.get('activeFlag').setValue(true);
        } else {
          this.form.get('activeFlag').setValue(false);
        }
        if (data.locked === 'Y') {
          this.form.get('locked').setValue(true);
        } else {
          this.form.get('locked').setValue(false);
        }

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
    let locked = this.form.get('locked');

    if (this.path === 'View') {
      activeFlag.disable();
      locked.disable();
    } else {
      activeFlag.enable();
      locked.enable();
    }
  }

  isFieldInvalid(field: string) {
    const fieldControl = this.form.get(field);
    return fieldControl.invalid && (fieldControl.dirty || fieldControl.touched);
  }

  // onSubmit() {
  //   this.validateAllFormFields(this.form);

  //   let activeFlagStatus = this.form.value.activeFlag;

  //   if (activeFlagStatus) {
  //     this.form.get('activeFlag').setValue('Y');
  //   } else {
  //     this.form.get('activeFlag').setValue('N');
  //   }

  //   let lockedStatus = this.form.value.locked;

  //   if (lockedStatus) {
  //     this.form.get('locked').setValue('Y');
  //   } else {
  //     this.form.get('locked').setValue('N');
  //   }

  //   if (this.id) {
  //     if (this.form.valid) {
  //       this.adminUsersService
  //         .editUser(this.id, this.form.value)
  //         .subscribe(data => {
  //           // const dataObject = JSON.parse(data['_body'])
  //           this.router.navigate(['/system-admin/users']);
  //         });
  //     }
  //   } else {
  //     if (this.form.valid) {
  //       this.adminUsersService.addUser(this.form.value).subscribe(data => {
  //         this.router.navigate(['/system-admin/users']);
  //       });
  //     }
  //   }
  // }
}
