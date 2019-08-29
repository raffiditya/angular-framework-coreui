import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { isFieldInvalid, normalizeFlag } from '../../../util';
import { UserService } from '../../service/user.service';

@Component({
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit {

  editable: boolean = false;
  form: FormGroup;
  id: number = 0;
  isFieldInvalid = isFieldInvalid;
  path: string = '';
  selectAuthProvider: any = [
    { value: 'LDAP', name: 'LDAP' },
    { value: 'LOCAL', name: 'LOCAL' },
  ];

  constructor(
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private toastr: ToastrService,
  ) {
    this.form = formBuilder.group({
      username: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/)
      ]),
      authProvider: new FormControl('', Validators.required),
      description: new FormControl(null),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', Validators.required),
      activeFlag: new FormControl(false, Validators.required),
      locked: new FormControl(false, Validators.required),
    }, {
      validator: this.confirmPasswordValidator
    });
  }

  ngOnInit() {
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('userId'));
    this.path = this.activatedRoute.snapshot.data.title;
    this.editable = this.activatedRoute.snapshot.data.editable;

    if (this.id) {
      this.userService.getUser(this.id)
        .subscribe(data => {
          // hacky stupid backend mistake.
          data.password = '';
          this.form.patchValue(data);

          this.form.get('activeFlag').setValue(data['activeFlag'] === 'Y');
          this.form.get('locked').setValue(data['locked'] === 'Y');

          if (this.editable) {
            this.form.enable();

            if (this.path === 'Edit') {
              this.form.get('password').clearValidators();
              this.form.get('password').updateValueAndValidity();
              this.form.get('confirmPassword').clearValidators();
              this.form.get('confirmPassword').updateValueAndValidity();
            }
          } else {
            this.form.disable();
          }
        });
    }
  }

  onChangePassword($event): void {
    if (this.path === 'Add') {
      return;
    }

    if ($event.target.value.length > 0) {
      this.form.get('confirmPassword').setValidators(Validators.required);
    } else {
      this.form.get('confirmPassword').clearValidators();
    }

    this.form.get('confirmPassword').updateValueAndValidity();
  }

  onAuthenticationChange($event): void {
    if (!this.editable) {
      return;
    }

    if ('LOCAL' !== $event.value) {
      this.form.get('password').disable();
      this.form.get('confirmPassword').disable();
    } else {
      this.form.get('password').enable();
      this.form.get('confirmPassword').enable();
    }

    this.form.get('password').setValue('');
    this.form.get('confirmPassword').setValue('');
  }

  confirmPasswordValidator(group: FormGroup): void {
    const passwordControl = group.get('password');
    const confirmPasswordControl = group.get('confirmPassword');

    if (passwordControl.pristine) {
      return;
    }

    let { requiredConfirmationError }: any = confirmPasswordControl.hasError('required')
                                             ? { required: true } : {};

    if (passwordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({
        ...requiredConfirmationError,
        mustMatch: true
      });
    } else {
      if (confirmPasswordControl.hasError('required')) {
        confirmPasswordControl.setErrors({ ...requiredConfirmationError });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    }
  }

  onSubmit() {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }

    this.form.get('confirmPassword').disable();
    let user: any = normalizeFlag(this.form);

    if (this.id) {
      this.userService.editUser(this.id, user)
        .subscribe(data => {
          this.router.navigate(['/admin/user'])
            .then(() => this.toastr.success(data.message, 'Edit User'));
        });
    } else {
      this.userService.addUser(user)
        .subscribe(data => {
          this.router.navigate(['admin/user'])
            .then(() => this.toastr.success(data.message, 'Add User'));
        });
    }
  }
}
