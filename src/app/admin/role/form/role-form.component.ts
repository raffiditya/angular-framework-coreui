import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { isFieldInvalid, normalizeFlag } from '../../../util';
import { RoleService } from '../../service';

@Component({
  templateUrl: './role-form.component.html',
})
export class RoleFormComponent implements OnInit {

  editable: boolean = false;
  form: FormGroup;
  id: number = 0;
  isFieldInvalid = isFieldInvalid;
  roleName: string = '';
  title: string = '';

  constructor(
    private roleService: RoleService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public location: Location,
  ) {
    this.form = formBuilder.group({
      activeFlag: new FormControl(false, Validators.required),
      name: new FormControl('', Validators.required),
      description: new FormControl(null),
    });
  }

  ngOnInit() {
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('roleId'));
    this.title = this.activatedRoute.snapshot.data.title;
    this.editable = this.activatedRoute.snapshot.data.editable;

    if (!this.editable) {
      this.form.disable();
    }

    if (this.id) {
      this.roleService
        .get(this.id)
        .subscribe(data => {
          this.roleName = data.name;
          this.form.patchValue(data);

          this.form.get('activeFlag').setValue(data.activeFlag === 'Y');
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
        .edit(this.id, normalizeFlag(this.form))
        .subscribe(() => this.location.back());
    } else {
      this.roleService.add(normalizeFlag(this.form))
        .subscribe(() => this.location.back());
    }
  }
}
