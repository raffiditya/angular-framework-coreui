import { Component, EventEmitter, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AdminUserService } from '../admin-user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { normalizeFlag } from '../../../shared/util/normalize-flag';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Page } from '../../../core/model/page';
import { MustMatch } from '../../../shared/musmatch/must-match.validators';

@Component({
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit {
  
  editable: boolean = false;
  id: number = 0;
  path: string = '';
  userData: any = null;
  page: Page = new Page();
  userTypehead: EventEmitter<string> = new EventEmitter<string>();
  form: FormGroup;
  selectAuthProvider: any = [
    { value: 'LDAP', name: 'LDAP' },
    { value: 'LOCAL', name: 'LOCAL' },
  ];

  constructor(
    private router: Router,
    private adminUserService: AdminUserService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private toastr: ToastrService,
  ) {
    this.form = formBuilder.group({
      username: new FormControl('', Validators.required),
      password: new FormControl(''),
      authProvider: new FormControl('', Validators.required),
      description: new FormControl(null),
      newPassword: new FormControl('', Validators.minLength(8)),
      cfmNewPassword: new FormControl(''),
      activeFlag: new FormControl(false, Validators.required),
      locked: new FormControl(false, Validators.required),
    }, {
      validator: MustMatch('newPassword', 'cfmNewPassword')
    });
  }

  ngOnInit() {
  
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.path = this.activatedRoute.snapshot.data.title;
    this.editable = this.path !== 'View';
    
    if (this.id) {
      this.adminUserService.getUser(this.id).subscribe(data => {
        this.form.patchValue(data);

        this.form.get('activeFlag').setValue(data['activeFlag'] === 'Y');
        this.form.get('locked').setValue(data['locked'] === 'Y');

        if(this.editable){
          this.form.enable();
          
          if(this.path === 'Edit'){
            this.clearPasswordValidators();
            this.resetPasswordValidators();
          }
        }
        else{
          this.form.disable();
        }
      });
    }
  }
  
  isFieldInvalid(field: string) {
    const fieldControl = this.form.get(field);
    return fieldControl.invalid && (fieldControl.dirty || fieldControl.touched);
  }

  checkPassword(){
    if(this.form.get('newPassword').value != ''){
      this.form.get('password').setValue(this.form.get('newPassword').value);
      this.form.get('newPassword').disable();
      this.form.get('cfmNewPassword').disable();  
    }
  }

  resetPassword(){
    this.form.get('newPassword').setValue('');
    this.form.get('cfmNewPassword').setValue('');
  }
  
  disablePassword(){
    if(this.form.get('authProvider').value === 'LOCAL'){
      if(this.path === 'Edit'){
        this.resetPasswordValidators();
        this.clearPasswordValidators();
        this.form.get('newPassword').enable();
        this.form.get('cfmNewPassword').enable();
      }
      else{
        this.resetPasswordValidators();
        this.clearPasswordValidators();
        this.updatePasswordValidators();
        this.form.get('newPassword').enable();
        this.form.get('cfmNewPassword').enable();
      }
    }
    else{
      this.resetPassword();
      this.form.get('newPassword').disable();
      this.form.get('cfmNewPassword').disable();
    }
   }

  clearPasswordValidators(){
    this.form.get('newPassword').clearValidators();
    this.form.get('newPassword').updateValueAndValidity();
  }

  resetPasswordValidators(){
    this.form.get('newPassword').setValidators([Validators.minLength(8)]);
    this.form.get('newPassword').updateValueAndValidity();
  }

  updatePasswordValidators(){
    this.form.get('newPassword').setValidators([Validators.required, Validators.minLength(8)]);
    this.form.get('newPassword').updateValueAndValidity();
  }

  onSubmit() {
    this.form.markAllAsTouched();

    if(!this.form.valid){
      return;
    }

    if(this.id){
      this.checkPassword();
      this.adminUserService
        .editUser(this.id, normalizeFlag(this.form))
        .subscribe(data => {
          this.router.navigate(['/admin/user']);
          this.toastr.success(data.message, 'Edit User');
        });
    }
    else{
      this.checkPassword();
      this.adminUserService
        .addUser(normalizeFlag(this.form))
        .subscribe(data => {
          this.router.navigate(['admin/user']);
          this.toastr.success(data.message, 'Add User');
        });
    }
  }
}