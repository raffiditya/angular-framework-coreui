import { Component, OnInit, EventEmitter} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { Router, ActivatedRoute} from '@angular/router';
import { AdminOrganizationService } from '../admin-organization.service';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { Page } from '../../../core/model/page';
import { FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import { normalizeFlag } from '../../../shared/util/normalize-flag';

@Component({
  templateUrl: './organization-form.component.html',
})
export class OrganizationFormComponent implements OnInit {
  
  editable: boolean = false;
  id: number = 0;
  path: string = '';
  organizationData: any[] = [];
  form: FormGroup;
  organizationTypeahead: EventEmitter<string> = new EventEmitter<string>();
  page: Page = new Page();

  constructor(
    private router: Router,
    private adminOrganizationService: AdminOrganizationService,
    private formBuilder: FormBuilder,
    private location: Location,
    private activatedRoute: ActivatedRoute,
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
    this.editable = this.path !== "View";
    this.searchOrganization();

    if (this.id) {
      this.adminOrganizationService.getOrganization(this.id).subscribe(data => {
        this.form.patchValue(data);
        
        this.form.get('activeFlag').setValue(data['activeFlag'] === 'Y');
        if(data['parentId']){
          this.setParent(data['parentId']);
        }

        if(this.editable){
          this.form.enable();
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

  setParent(parentId: number) {
    this.adminOrganizationService.getOrganization(parentId).subscribe(data => {
      this.organizationData = [data];
      this.form.get('parentId').setValue(parentId);
    });
  }

  searchOrganization() {
    this.organizationData = [];
    
    this.organizationTypeahead
      .pipe(
        filter(t => t && t.length > 2),
        distinctUntilChanged(),
        debounceTime(300),
        switchMap(term => this.adminOrganizationService.getOrganizations(this.page)),
      )
      .subscribe (data =>{
        this.organizationData = data['content'];
      });
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if(!this.form.valid){
      return;
    }

    if (this.id) {
      this.adminOrganizationService
      .editOrganization(this.id, normalizeFlag(this.form) )
        .subscribe(data => {
          this.router.navigate(['/admin/organizations']);
          this.toastr.success(data.message, 'Edit Organization');
        });
    }
    else {

      this.adminOrganizationService
        .addOrganization(normalizeFlag(this.form))
        .subscribe(data => {
          this.router.navigate(['/admin/organizations']);
          this.toastr.success(data.message, 'Add Organization')
        });
    }
  }
}
