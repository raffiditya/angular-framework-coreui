import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { AdminMenuService } from '../menu-service/admin-menu.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  templateUrl: './menu-form.component.html',
  styleUrls: ['./menu-form.component.css']
})
export class MenuFormComponent implements OnInit {

  id = 0
  path = ''
  parentMenu = null
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
  ]

  constructor(
    private router: Router,
    private adminMenuService: AdminMenuService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute) {
    this.form = formBuilder.group({
      activeFlag: new FormControl(null, Validators.required),
      name: new FormControl('', Validators.required),
      description: new FormControl(null),
      url: new FormControl('', Validators.required),
      icon: new FormControl(''),
      orderNo: new FormControl(0),
      titleFlag: new FormControl(null),
      parentId: new FormControl(null),
    });
  }

  ngOnInit() {
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'))
    this.path = this.activatedRoute.snapshot.data.title

    if (this.id) {
      this.adminMenuService.getMenu(this.id)
        .subscribe(
          (data) => {
            let dataObject = data

            if (data.activeFlag === 'Y') {
              this.form.get('activeFlag').setValue(true)
            } else {
              this.form.get('activeFlag').setValue(false)
            }

            this.form.get('name').setValue(data.name)
            this.form.get('description').setValue(data.description)
            this.form.get('url').setValue(data.url)
            this.form.get('icon').setValue(data.icon)
            this.form.get('orderNo').setValue(data.orderNo)

            if (data.titleFlag === 'Y') {
              this.form.get('titleFlag').setValue(true)
            } else {
              this.form.get('titleFlag').setValue(false)
            }

            this.setParent(data.parentId)
          }
        )
    } 
  }

  onDisabled() {
    if (this.path === 'view') {
      return true
    } else {
      return false
    }
  }

  onSelectDisabled() {
    let icon = this.form.get('icon')
    let parentId = this.form.get('parentId')

    if (this.path === 'view') {
      icon.disable()
      parentId.disable()
    } else {
      icon.enable()
      parentId.enable()
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
      this.adminMenuService.getMenu(ParentId)
        .subscribe(
          (data) => {
            this.parentMenu = [data]
            this.form.get('parentId').setValue(ParentId)

            if (this.path === 'view') {
              this.onSelectDisabled()
            }
          }
        )
    } else {
      this.form.get('parentId').setValue(ParentId)

      if (this.path === 'view') {
        this.onSelectDisabled()
      }
    } 
  }

  onChangeParent(text) {
    let searchTerm: string = text.term;

    if (!searchTerm || searchTerm.length < 3) {
      this.parentMenu = [];
      return;
    } else {
      this.adminMenuService.searchMenu(searchTerm)
        .subscribe(
          (data) => {
            this.parentMenu = data;
          }
        )
    }
  }

  displayRadioValue() {
    console.log('masuk')
  }

  onSubmit() {
    let activeFlagStatus = this.form.value.activeFlag;
    let activeFlagResults = '';

    if (activeFlagStatus) {
      activeFlagResults = 'Y'
    } else {
      activeFlagResults = 'N'
    }

    let titleFlagStatus = this.form.value.titleFlag
    let titleFlagResults = ''

    if (titleFlagStatus) {
      titleFlagResults = 'Y'
    } else {
      titleFlagResults = 'N'
    }

    let newFormValue = {
      activeFlag: activeFlagResults,
      name: this.form.value.name,
      description: this.form.value.description,
      url: this.form.value.url,
      icon: this.form.value.icon,
      orderNo: this.form.value.orderNo,
      titleFlag: titleFlagResults,
      parentId: this.form.value.parentId
    }

    this.validateAllFormFields(this.form)

    if (this.id) {
      this.adminMenuService.editMenu(this.id, newFormValue)
        .subscribe(
          (data) => {
            // const dataObject = JSON.parse(data['_body'])
            this.router.navigate(['/menu'])
          }
        )
    } else {
      if (this.form.valid) {
        this.adminMenuService.addMenu(newFormValue)
          .subscribe(
            (data) => {
              this.router.navigate(['/menu'])
            }
          )
      } 
    }
  }
}
