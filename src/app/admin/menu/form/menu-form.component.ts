import { Component, EventEmitter, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AdminMenuService } from '../admin-menu.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { normalizeFlag } from '../../../shared/util/normalizeFlag';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Page } from '../../../core/model/page';

@Component({
  templateUrl: './menu-form.component.html',
  styleUrls: ['./menu-form.component.css'],
})
export class MenuFormComponent implements OnInit {
  id = 0;
  path = '';
  parentMenu = null;
  page = new Page();
  menuTypeahead = new EventEmitter<string>();
  customNoItemFound = ''
  form: FormGroup;
  icons = [
    { value: 'icon-user', name: 'icon-user' },
    { value: 'icon-people', name: 'icon-people' },
    { value: 'icon-user-female', name: 'icon-user-female' },
    { value: 'icon-phone', name: 'icon-phone' },
    { value: 'icon-login', name: 'icon-login' },
    { value: 'icon-logout', name: 'icon-logout' },
    { value: 'icon-menu', name: 'icon-menu' },
    { value: 'icon-list', name: 'icon-list' },
    { value: 'icon-options-vertical', name: 'icon-options-vertical' },
    { value: 'icon-options', name: 'icon-options' },
    { value: 'icon-cursor', name: 'icon-cursor' },
    { value: 'icon-speedometer', name: 'icon-speedometer' },
    { value: 'icon-shield', name: 'icon-shield' },
    { value: 'icon-screen-desktop', name: 'icon-screen-desktop' },
    { value: 'icon-envelope-open', name: 'icon-envelope-open' },
    { value: 'icon-wallet', name: 'icon-wallet' },
    { value: 'icon-speech', name: 'icon-speech' },
    { value: 'icon-puzzle', name: 'icon-puzzle' },
    { value: 'icon-printer', name: 'icon-printer' },
    { value: 'icon-credit-card', name: 'icon-credit-card' },
    { value: 'icon-star', name: 'icon-star' },
    { value: 'icon-settings', name: 'icon-settings' },
    { value: 'icon-power', name: 'icon-power' },
    { value: 'icon-magnifier-add', name: 'icon-magnifier-add' },
    { value: 'icon-link', name: 'icon-link' },
    { value: 'icon-cloud-download', name: 'icon-cloud-download' },
    { value: 'icon-paper-plane', name: 'icon-paper-plane' },
    { value: 'icon-grid', name: 'icon-grid' },
    { value: 'icon-home', name: 'icon-home' },
    { value: 'icon-pencil', name: 'icon-pencil' },
    { value: 'icon-rocket', name: 'icon-rocket' },
    { value: 'icon-share', name: 'icon-share' },
  ];

  constructor(
    private router: Router,
    private adminMenuService: AdminMenuService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private toastr: ToastrService,
  ) {
    this.onChangeParent(null)

    this.form = formBuilder.group({
      activeFlag: new FormControl(false, Validators.required),
      name: new FormControl('', Validators.required),
      description: new FormControl(null),
      url: new FormControl(''),
      icon: new FormControl(''),
      orderNo: new FormControl(0),
      titleFlag: new FormControl(false),
      parentId: new FormControl(null),
    });
  }

  ngOnInit() {
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.path = this.activatedRoute.snapshot.data.title;

    if (this.id) {
      this.adminMenuService.getMenu(this.id).subscribe(data => {
        this.form.patchValue(data);

        if (data['activeFlag'] === 'Y') {
          this.form.get('activeFlag').setValue(true);
        } else {
          this.form.get('activeFlag').setValue(false);
        }

        if (data['titleFlag'] === 'Y') {
          this.form.get('titleFlag').setValue(true);
        } else {
          this.form.get('titleFlag').setValue(false);
        }

        this.setParent(data['parentId']);
      });
    }
  }

  setParent(parentId: number) {
    if (parentId) {
      this.adminMenuService.getMenu(parentId).subscribe(data => {
        this.parentMenu = [data];
        this.form.get('parentId').setValue(parentId);
        this.formDisabled();
      });
    } else {
      this.form.get('parentId').setValue(parentId);
      this.formDisabled();
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

  onChangeParent(text: { term: any; }) {
    this.parentMenu = [];

    if (!text || text.term.length < 2){
      this.menuTypeahead.pipe(
        distinctUntilChanged(),
        debounceTime(300),
        switchMap(term => this.parentMenu = [])
      ).subscribe(data => {
        this.parentMenu = [];
      })
    } else if (text.term.length >= 2) {
      this.page.searchTerm = text.term;
      this.menuTypeahead.pipe(
        distinctUntilChanged(),
        debounceTime(300),
        switchMap(term => this.adminMenuService.getMenus(this.page))
      ).subscribe(data => {
        this.parentMenu = data['content'];
      })
    }
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
      this.adminMenuService
        .editMenu(this.id, normalizedFormValue)
        .subscribe(data => {
          this.router.navigate(['/admin/menu']);
          this.showSuccessEdit(data.message);
        });
    } else {
      this.adminMenuService.addMenu(normalizedFormValue).subscribe(data => {
        this.router.navigate(['/admin/menu']);
        this.showSuccessAdd(data.message);
      });
    }
  }

  showSuccessEdit(message: string) {
    this.toastr.success(message, 'Edit Menu');
  }

  showSuccessAdd(message: any) {
    this.toastr.success(message, 'Add Menu');
  }
}
