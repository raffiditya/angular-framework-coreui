import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { AdminMenuService } from '../admin-menu.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NormalizeFlag } from '../../../shared/util/normalizeFlag';
import { FORMERR } from 'dns';
import { Key } from 'protractor';
import { isBoolean } from 'util';

@Component({
  templateUrl: './menu-form.component.html',
  styleUrls: ['./menu-form.component.css'],
})
export class MenuFormComponent implements OnInit {
  id = 0;
  path = '';
  parentMenu = null;
  loading = false;
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
        if (data['activeFlag'] === 'Y') {
          this.form.get('activeFlag').setValue(true);
        } else {
          this.form.get('activeFlag').setValue(false);
        }

        this.form.get('name').setValue(data['name']);
        this.form.get('description').setValue(data['description']);
        this.form.get('url').setValue(data['url']);
        this.form.get('icon').setValue(data['icon']);
        this.form.get('orderNo').setValue(data['orderNo']);

        if (data['titleFlag'] === 'Y') {
          this.form.get('titleFlag').setValue(true);
        } else {
          this.form.get('titleFlag').setValue(false);
        }

        this.setParent(data['parentId']);
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
    let icon = this.form.get('icon');
    let parentId = this.form.get('parentId');
    let activeFlag = this.form.get('activeFlag');
    let titleFlag = this.form.get('titleFlag');

    if (this.path === 'View') {
      icon.disable();
      parentId.disable();
      activeFlag.disable();
      titleFlag.disable();
    } else {
      icon.enable();
      parentId.enable();
      activeFlag.enable();
      titleFlag.enable();
    }
  }

  isFieldInvalid(field: string) {
    const fieldControl = this.form.get(field);
    return fieldControl.invalid && (fieldControl.dirty || fieldControl.touched);
  }

  setParent(ParentId) {
    if (ParentId) {
      this.adminMenuService.getMenu(ParentId).subscribe(data => {
        this.parentMenu = [data];
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

    if (searchTerm.length === 0) {
      this.loading = false;
    } else if (
      (searchTerm.length > 0 && searchTerm.length < 3) ||
      !searchTerm
    ) {
      this.parentMenu = null;
      this.loading = true;
      return false;
    } else {
      this.adminMenuService.selectMenu(searchTerm).subscribe(data => {
        this.parentMenu = data['content'];
        this.loading = false;
      });
    }
  }

  // normalizeFlag(form: FormGroup): any {
  //   let copiedFormValue = Object.assign({}, form.value);
  //   Object.keys(copiedFormValue).forEach(key => {
  //     const value = copiedFormValue[key];
  //     if (typeof value === 'boolean') {
  //       copiedFormValue[key] = value ? 'Y' : 'N';
  //     }
  //   });

  //   return copiedFormValue;
  // }

  cancelButton() {
    this.location.back();
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    let normalizedFormValue = NormalizeFlag(this.form);

    if (this.id) {
      this.adminMenuService
        .editMenu(this.id, normalizedFormValue)
        .subscribe(data => {
          this.router.navigate(['/admin/menu']);
          this.showSuccessEdit();
        });
    } else {
      this.adminMenuService.addMenu(normalizedFormValue).subscribe(data => {
        this.router.navigate(['/admin/menu']);
        this.showSuccessAdd();
      });
    }
  }

  showSuccessEdit() {
    this.toastr.success('Menu is edited', 'Edit Menu');
  }

  showSuccessAdd() {
    this.toastr.success('Menu is successfully added', 'Add Menu');
  }
}
