import { Location } from '@angular/common';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { debounceTime, filter, switchMap, tap } from 'rxjs/operators';
import { isFieldInvalid, normalizeFlag } from '../../../../util';
import { Organization } from '../../../model';
import { OrganizationService, UserOrganizationService } from '../../../service';

@Component({
  templateUrl: './user-organization-form.component.html',
})
export class UserOrganizationFormComponent implements OnInit {

  currentDate = new Date();
  editable: boolean = false;
  form: FormGroup;
  id: number = 0;
  isFieldInvalid = isFieldInvalid;
  organizationTypeahead: EventEmitter<string> = new EventEmitter<string>();
  organizations: Organization[] = [];
  title: string = '';
  userId: number;

  constructor(
    private userOrganizationService: UserOrganizationService,
    private organizationService: OrganizationService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public location: Location
  ) {
    this.form = formBuilder.group({
      userId: new FormControl(null, Validators.required),
      organizationId: new FormControl(null, Validators.required),
      startDate: new FormControl(
        moment().format('YYYY-MM-DD'),
        Validators.required,
      ),
      endDate: new FormControl(
        moment('9999-12-31').format('YYYY-MM-DD'),
        Validators.required,
      ),
      activeFlag: new FormControl(false, Validators.required)
    });
  }

  ngOnInit() {
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('userOrgId'));
    this.userId = Number(this.activatedRoute.snapshot.paramMap.get('userId'));
    this.title = this.activatedRoute.snapshot.data.title;
    this.editable = this.activatedRoute.snapshot.data.editable;
    this.searchOrganization();
    this.form.get('userId').setValue(this.userId);

    if (!this.editable) {
      this.form.disable();
    }

    if (this.id) {
      this.userOrganizationService
        .get(this.id)
        .subscribe(data => {
          this.form.patchValue(data);

          this.form.get('activeFlag').setValue(data.activeFlag === 'Y');
          this.form.get('organizationId').patchValue(data.organization.id);
          this.organizations = [data.organization];
        });
    }
  }

  searchOrganization() {
    this.organizationTypeahead
      .pipe(
        tap(() => this.organizations = []),
        filter(t => t && t.length >= 2),
        debounceTime(300),
        switchMap(searchText => this.organizationService.search(searchText))
      )
      .subscribe(data => this.organizations = data);
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    if (this.id) {
      this.userOrganizationService
        .edit(this.id, normalizeFlag(this.form))
        .subscribe(() => this.location.back());
    } else {
      this.userOrganizationService
        .add(normalizeFlag(this.form))
        .subscribe(() => this.location.back());
    }
  }
}
