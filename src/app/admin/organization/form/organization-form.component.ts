import { Location } from '@angular/common';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, filter, switchMap, tap } from 'rxjs/operators';
import { isFieldInvalid, normalizeFlag } from '../../../util';
import { Organization } from '../../model';
import { OrganizationService } from '../../service';

@Component({
  templateUrl: './organization-form.component.html',
})
export class OrganizationFormComponent implements OnInit {

  editable: boolean = false;
  form: FormGroup;
  id: number = 0;
  isFieldInvalid = isFieldInvalid;
  organizationTypeahead: EventEmitter<string> = new EventEmitter<string>();
  parentOrganization: Organization[] = [];
  title: string = '';

  constructor(
    private organizationService: OrganizationService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public location: Location
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
    this.title = this.activatedRoute.snapshot.data.title;
    this.editable = this.activatedRoute.snapshot.data.editable;
    this.searchOrganization();

    if (!this.editable) {
      this.form.disable();
    }

    if (this.id) {
      this.organizationService
        .get(this.id)
        .subscribe(data => {
          this.form.patchValue(data);

          this.form.get('activeFlag').setValue(data.activeFlag === 'Y');
          if (data.parentId) {
            this.setParent(data.parentId);
          }
        });
    }
  }

  setParent(parentId: number) {
    this.organizationService
      .get(parentId)
      .subscribe(data => this.parentOrganization = [data]);
  }

  searchOrganization() {
    this.organizationTypeahead
      .pipe(
        tap(() => this.parentOrganization = []),
        filter(t => t && t.length >= 2),
        debounceTime(300),
        switchMap(searchText => this.organizationService.search(searchText)),
      )
      .subscribe(data => this.parentOrganization = data);
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    if (this.id) {
      this.organizationService
        .edit(this.id, normalizeFlag(this.form))
        .subscribe(() => this.location.back());
    } else {
      this.organizationService
        .add(normalizeFlag(this.form))
        .subscribe(() => this.location.back());
    }
  }
}
