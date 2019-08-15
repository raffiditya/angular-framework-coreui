import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { AdminOrganizationService } from '../admin-organization.service';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'admin-organization-form',
  templateUrl: './organization-form.component.html',
  styleUrls: ['./organization-form.component.css'],
})
export class OrganizationFormComponent implements OnInit {
  id = 0;
  path = '';
  organizationData = null;
  form: FormGroup;

  constructor(
    private router: Router,
    private adminOrganizationService: AdminOrganizationService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
  ) {
    this.form = formBuilder.group({
      name: new FormControl('', Validators.required),
      codeName: new FormControl('', Validators.required),
      abbriviation: new FormControl('', Validators.required),
      description: new FormControl(null),
      parentId: new FormControl(null),
    });
  }

  ngOnInit() {
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.path = this.activatedRoute.snapshot.data.title;

    if (this.id) {
      this.adminOrganizationService.getOrganization(this.id).subscribe(data => {
        this.form.get('name').setValue(data.name);
        this.form.get('codeName').setValue(data.codeName);
        this.form.get('abbriviation').setValue(data.abbriviation);
        this.form.get('description').setValue(data.description);

        this.setParent(data.parentId);
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
    let parentId = this.form.get('parentId');

    if (this.path === 'View') {
      parentId.disable();
    } else {
      parentId.enable();
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

  setParent(ParentId) {
    if (ParentId) {
      this.adminOrganizationService
        .getOrganization(ParentId)
        .subscribe(data => {
          this.organizationData = [data];
          this.form.get('parentId').setValue(ParentId);

          if (this.path === 'View') {
            this.onSelectDisabled();
          }
        });
    } else {
      this.form.get('parentId').setValue(ParentId);

      if (this.path === 'View') {
        this.onSelectDisabled();
      }
    }
  }

  onChangeParent(text) {
    let searchTerm: string = text.term;
    console.log(text);
    if (!searchTerm || searchTerm.length < 3) {
      this.organizationData = [];
      return;
    } else {
      this.adminOrganizationService
        .searchOrganization(searchTerm)
        .subscribe(data => {
          this.organizationData = data;
        });
    }
  }

  onSubmit() {
    this.validateAllFormFields(this.form);

    if (this.id) {
      if (this.form.valid) {
        this.adminOrganizationService
          .editOrganization(this.id, this.form.value)
          .subscribe(data => {
            // const dataObject = JSON.parse(data['_body'])
            this.router.navigate(['/system-admin/organizations']);
          });
      }
    } else {
      if (this.form.valid) {
        this.adminOrganizationService
          .addOrganization(this.form.value)
          .subscribe(data => {
            this.router.navigate(['/system-admin/organizations']);
          });
      }
    }
  }
}
