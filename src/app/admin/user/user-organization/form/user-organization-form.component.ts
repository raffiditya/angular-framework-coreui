import { Component, EventEmitter, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AdminUserOrganizationService } from '../user-organization.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { normalizeFlag } from '../../../../shared/util/normalize-flag';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { Page } from '../../../../core/model/page';

@Component({
  templateUrl: './user-organization-form.component.html',
})
export class UserOrganizationFormComponent implements OnInit {
  editable: boolean = false;
  userId: number = 0;
  assignedOrganizationId: number = 0;
  path: string = '';
  user: any[] = [];
  organizations: any[] = [];
  page: Page = new Page();
  organizationTypeahead: EventEmitter<string> = new EventEmitter<string>();
  form: FormGroup;

  minDate = new Date(1960, 0, 0);
  maxDate = new Date(9999, 0, 0);
  minEndDate = new Date();
  
  constructor(
    private router: Router,
    private adminUserOrganizationService: AdminUserOrganizationService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private toastr: ToastrService,
  ) {
    this.form = formBuilder.group({
      activeFlag: new FormControl(false, Validators.required),
      userId: new FormControl(null, Validators.required),
      organizationId: new FormControl(null, Validators.required),
      startDate: new FormControl(
        new Date().toISOString().slice(0, 10),
        Validators.required,
      ),
      endDate: new FormControl(new Date().toISOString().slice(0, 10)),
    });
  }

  ngOnInit() {
    this.userId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.assignedOrganizationId = Number(
      this.activatedRoute.snapshot.paramMap.get('organizationid'),
    );
    this.path = this.activatedRoute.snapshot.data.title;
    this.editable = this.path !== 'View';
    this.searchOrganization();

    if (this.assignedOrganizationId === 0 && this.path === 'Add') {
      this.checkStartDate();
      this.adminUserOrganizationService.getUser(this.userId).subscribe(data => {
        this.user = [data];
        this.form.get('userId').patchValue(data.id);
        this.form.get('userId').disable();
        this.form.get('endDate').patchValue('9999-12-31');
      });
    } else {
      this.checkStartDate();
      this.adminUserOrganizationService
        .getAssignedOrganization(this.assignedOrganizationId)
        .subscribe(data => {
          this.form.patchValue(data);

          this.form.get('activeFlag').setValue(data['activeFlag'] === 'Y');
          this.user = [data['user']];
          this.form.get('userId').patchValue(data['user'].id);
          this.organizations = [data.organization];
          this.form.get('organizationId').patchValue(data.organization.id);

          if (this.editable) {
            this.form.enable();
            this.form.get('userId').disable();
          } else {
            this.form.disable();
          }
        });
    }
  }

  checkStartDate(){
    this.minEndDate = new Date(this.form.get('startDate').value);
  }

  isFieldInvalid(field: string) {
    const fieldControl = this.form.get(field);
    return fieldControl.invalid && (fieldControl.dirty || fieldControl.touched);
  }

  searchOrganization() {
    this.organizations = [];

    this.organizationTypeahead
      .pipe(
        filter(t => t && t.length >= 2),
        distinctUntilChanged(),
        debounceTime(300),
        switchMap(term => {
          return this.adminUserOrganizationService.getOrganizations(this.page);
        }),
      )
      .subscribe(data => {
        this.organizations = data['content'];
      });
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    this.form.get('userId').enable();

    if (this.assignedOrganizationId === 0 && this.path === 'Add') {
      this.adminUserOrganizationService
        .addAssignedOrganization(normalizeFlag(this.form))
        .subscribe(data => {
          this.toastr.success(data.message, 'Assign User to Organization');
          this.location.back();
        });
    } else {
      this.adminUserOrganizationService
        .editAssignedOrganization(this.assignedOrganizationId, normalizeFlag(this.form))
        .subscribe(data => {
          this.toastr.success(data.message, 'Edit Assign User to Organization');
          this.location.back();
        });
    }
  }
}
