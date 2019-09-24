import { Location } from '@angular/common';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, filter, switchMap, tap } from 'rxjs/operators';
import { Page } from '../../../core/model/page.model';
import { isFieldInvalid, normalizeFlag } from '../../../util';
import { OrganizationService } from '../../service/organization.service';

@Component({
  templateUrl: './organization-form.component.html',
})
export class OrganizationFormComponent implements OnInit {

  editable: boolean = false;
  form: FormGroup;
  id: number = 0;
  isFieldInvalid = isFieldInvalid;
  organizationTypeahead: EventEmitter<string> = new EventEmitter<string>();
  parentOrganization: any[] = [];
  path: string = '';

  constructor(
    private router: Router,
    private adminOrganizationService: OrganizationService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public location: Location,
    private toastr: ToastrService,
  ) {
    this.form = formBuilder.group({
      name: new FormControl('', Validators.required),
      codeName: new FormControl('', Validators.required),
      abbreviation: new FormControl('', Validators.required),
      description: new FormControl(null),
      parentId: new FormControl(null),
      activeFlag: new FormControl(false, Validators.required),
    });
  }

  ngOnInit() {
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.path = this.activatedRoute.snapshot.data.title;
    this.editable = this.activatedRoute.snapshot.data.editable;
    this.searchOrganization();

    if (this.id) {
      this.adminOrganizationService.getOrganization(this.id).subscribe(data => {
        this.form.patchValue(data);

        this.form.get('activeFlag').setValue(data['activeFlag'] === 'Y');
        if (data['parentId']) {
          this.setParent(data.parentId);
        }

        if (this.editable) {
          this.form.enable();
        } else {
          this.form.disable();
        }
      });
    }
  }

  setParent(parentId: number) {
    this.adminOrganizationService.getOrganization(parentId).subscribe(data => {
      this.parentOrganization = [data];
      this.form.get('parentId').setValue(parentId);
    });
  }

  searchOrganization() {
    this.organizationTypeahead
      .pipe(
        tap(() => this.parentOrganization = []),
        filter(t => t && t.length >= 2),
        debounceTime(300),
        switchMap(searchTerm => {
          let page: Page = {
            size: 3,
            pageNumber: 1,
            searchTerm: searchTerm
          };

          return this.adminOrganizationService.getOrganizations(page);
        }),
      )
      .subscribe(data => {
        this.parentOrganization = data.content;
      });
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    if (this.id) {
      this.adminOrganizationService
        .editOrganization(this.id, normalizeFlag(this.form))
        .subscribe(data => {
          this.router.navigate(['/admin/organizations'])
            .then(() => this.toastr.success(data.message, 'Edit Organization'));
        });
    } else {
      this.adminOrganizationService
        .addOrganization(normalizeFlag(this.form))
        .subscribe(data => {
          this.router.navigate(['/admin/organizations'])
            .then(() => this.toastr.success(data.message, 'Add Organization'));
        });
    }
  }
}
