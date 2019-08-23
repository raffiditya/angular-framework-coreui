import { Component, EventEmitter, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AdminMenuService } from '../admin-menu.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { normalizeFlag } from '../../../shared/util/normalize-flag';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
} from 'rxjs/operators';
import { Page } from '../../../core/model/page';

@Component({
  templateUrl: './menu-form.component.html',
})
export class MenuFormComponent implements OnInit {
  editable: boolean = false;
  id: number = 0;
  path: string = '';
  parentMenu: any[] = [];
  page: Page = new Page();
  menuTypeahead: EventEmitter<string> = new EventEmitter<string>();
  form: FormGroup;
  icons: any[] = [
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
    this.editable = this.path !== 'View';

    if (this.id) {
      this.adminMenuService.getMenu(this.id).subscribe(data => {
        this.form.patchValue(data);

        this.form.get('activeFlag').setValue(data['activeFlag'] === 'Y');
        this.form.get('titleFlag').setValue(data['titleFlag'] === 'Y');
        if (data['parentId']) {
          this.setParent(data['parentId']);
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
    this.adminMenuService.getMenu(parentId).subscribe(data => {
      this.parentMenu = [data];
      this.form.get('parentId').setValue(parentId);
    });
  }

  isFieldInvalid(field: string) {
    const fieldControl = this.form.get(field);
    return fieldControl.invalid && (fieldControl.dirty || fieldControl.touched);
  }

  onChangeParent(text: { term: any }) {
    this.parentMenu = [];

    this.page.searchTerm = text.term;
    this.menuTypeahead
      .pipe(
        filter(t => t && t.length > 2),
        distinctUntilChanged(),
        debounceTime(300),
        switchMap(term => this.adminMenuService.getMenus(this.page)),
      )
      .subscribe(data => {
        this.parentMenu = data['content'];
      });
  }

  cancelButton() {
    this.location.back();
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    if (this.id) {
      this.adminMenuService
        .editMenu(this.id, normalizeFlag(this.form))
        .subscribe(data => {
          this.router.navigate(['/admin/menu']);
          this.toastr.success(data.message, 'Edit Menu');
        });
    } else {
      this.adminMenuService
        .addMenu(normalizeFlag(this.form))
        .subscribe(data => {
          this.router.navigate(['/admin/menu']);
          this.toastr.success(data.message, 'Add Menu');
        });
    }
  }
}
