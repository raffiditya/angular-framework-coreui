import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { isFieldInvalid, normalizeFlag } from '../../../util';
import { UserService } from '../../service';

@Component({
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit {

  editable: boolean = false;
  form: FormGroup;
  id: number = 0;
  isFieldInvalid = isFieldInvalid;
  readonly selectAuthProvider: any = [
    { value: 'LDAP', name: 'LDAP' },
    { value: 'LOCAL', name: 'LOCAL' },
  ];
  title: string = '';

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public location: Location
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
    this.title = this.activatedRoute.snapshot.data.title;
    this.editable = this.activatedRoute.snapshot.data.editable;

    if (!this.editable) {
      this.form.disable();
    }

    if (this.id) {
      this.userService
        .get(this.id)
        .subscribe(data => {
          this.form.patchValue(data);

          this.form.get('activeFlag').setValue(data.activeFlag === 'Y');
          this.form.get('locked').setValue(data.locked === 'Y');

          // Change Password validator
          if (this.editable) {
            this.form.get('password').clearValidators();
            this.form.get('password').updateValueAndValidity();
            this.form.get('confirmPassword').clearValidators();
            this.form.get('confirmPassword').updateValueAndValidity();
          }
        });
    }
  }

  onChangePassword($event): void {
    if (this.title === 'Add') {
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
    if (!this.editable || !$event) {
      return;
    }

    if ('LOCAL' === $event.value) {
      this.form.get('password').enable();
      this.form.get('confirmPassword').enable();
    } else {
      this.form.get('password').disable();
      this.form.get('confirmPassword').disable();
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
                                             ? { required: true }
                                             : {};

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

    // Disable to remove confirmation from body request.
    this.form.get('confirmPassword').disable();
    let user: any = normalizeFlag(this.form);

    if (this.id) {
      this.userService
        .edit(this.id, user)
        .subscribe(() => this.location.back());
    } else {
      this.userService
        .add(user)
        .subscribe(() => this.location.back());
    }
  }
}
