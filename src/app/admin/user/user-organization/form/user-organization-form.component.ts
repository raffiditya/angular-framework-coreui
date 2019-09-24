import { Location } from '@angular/common';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, filter, switchMap } from 'rxjs/operators';
import { Page } from '../../../../core/model/page.model';
import { isFieldInvalid, normalizeFlag } from '../../../../util';
import { OrganizationService } from '../../../service/organization.service';
import { UserOrganizationService } from '../../../service/user-organization.service';

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
  organizations: any[] = [];
  path: string = '';
  userId: number;

  constructor(
    private router: Router,
    private userOrganizationService: UserOrganizationService,
    private organizationService: OrganizationService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public location: Location,
    private toastr: ToastrService,
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
    this.path = this.activatedRoute.snapshot.data.title;
    this.editable = this.activatedRoute.snapshot.data.editable;
    this.searchOrganization();

    this.form.get('userId').setValue(this.userId);
    if (this.id) {
      this.userOrganizationService.getAssignedOrganization(this.id)
        .subscribe(data => {
          this.form.patchValue(data);

          this.form.get('activeFlag').setValue(data['activeFlag'] === 'Y');
          this.form.get('organizationId').patchValue(data.organization.id);
          this.organizations = [data.organization];

          if (this.editable) {
            this.form.enable();
          } else {
            this.form.disable();
          }
        });
    }
  }

  searchOrganization() {
    this.organizationTypeahead
      .pipe(
        filter(t => t && t.length >= 2),
        debounceTime(300),
        switchMap(searchTerm => {
          let page: Page = {
            size: 3,
            pageNumber: 1,
            searchTerm: searchTerm
          };

          return this.organizationService.getOrganizations(page);
        }),
      )
      .subscribe(data => {
        this.organizations = data.content;
      });
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    if (this.id) {
      this.userOrganizationService.editAssignedOrganization(this.id, normalizeFlag(this.form))
        .subscribe(data => {
          this.toastr.success(data.message, 'Edit Assign Organization to User');
          this.location.back();
        });

    } else {
      this.userOrganizationService.addAssignedOrganization(normalizeFlag(this.form))
        .subscribe(data => {
          this.toastr.success(data.message, 'Add Assign Organization to User');
          this.location.back();
        });
    }
  }
}
