import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {AdminRoleService} from '../admin-role.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {normalizeFlag} from '../../../shared/util/normalize-flag';

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
    private location: Location,
    private toastr: ToastrService,
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
        this.form.patchValue(data);

        if (data['activeFlag'] === 'Y') {
          this.form.get('activeFlag').setValue(true);
        } else {
          this.form.get('activeFlag').setValue(false);
        }

        this.form.get('name').setValue(data['name']);
        this.form.get('description').setValue(data['description']);

        this.formDisabled();
      });
    }
  }

  formDisabled() {
    if (this.path === 'View') {
      this.form.disable()
    } else {
      this.form.enable()
    }
  }

  isFieldInvalid(field: string) {
    const fieldControl = this.form.get(field);
    return fieldControl.invalid && (fieldControl.dirty || fieldControl.touched);
  }

  cancelButton() {
    this.location.back();
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    let normalizedFormValue = normalizeFlag(this.form);

    if (this.id) {
      if (this.form.valid) {
        this.adminRoleService
          .editRole(this.id, normalizedFormValue)
          .subscribe(data => {
            this.router.navigate(['/admin/role']);
            this.toastr.success(data.message, 'Edit Role');;
          });
      }
    } else {
      if (this.form.valid) {
        this.adminRoleService.addRole(normalizedFormValue).subscribe(data => {
          this.router.navigate(['/admin/role']);
          this.toastr.success(data.message, 'Add Role');;
        });
      }
    }
  }
}
