import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core'

import { NavigationService } from '../../../core/services/navigation.service'
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  templateUrl: './menu-form.component.html',
  styleUrls: ['./menu-form.component.css']
})
export class MenuFormComponent implements OnInit {
  id = 0
  title = ''
  initialData = null
  form: FormGroup;
  status = [
    { value: 'true', name: 'True' },
    { value: 'false', name: 'False' }
  ]
  icons = [
    { value: 'icon-user' , name: 'icon-user' },
    { value: 'icon-login' , name: 'icon-login' },
    { value: 'icon-logout' , name: 'icon-logout' }
  ]

  constructor(
    private router: Router,
    private navigationService: NavigationService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
  ) {
    this.form = formBuilder.group({
      activeFlag: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      description: new FormControl(null),
      url: new FormControl('', Validators.required),
      icon: new FormControl(''),
      orderNo: new FormControl(0),
      titleFlag: new FormControl(null),
      parentId: new FormControl(0),
      children: new FormControl(null)
    })
  }

  ngOnInit() {
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'))
    
    if (this.id !== 0) {
      let route = this.activatedRoute.routeConfig.path.split('/')
      this.title = route[0]
    } else {
      this.title = this.activatedRoute.routeConfig.path
    }

    if (this.id) {
      // this.navigationService.getMenu()
      //   .subscribe(
      //     (data) => {
      //       const dataObject = JSON.parse(data['_body'])
      //       this.initialData = dataObject
            
      //       for (let i = 0; i < dataObject.length; i++) {
      //         if (this.id === dataObject[i].id) {
      //           this.form.get('name').setValue(dataObject[i].name)
      //           this.form.get('url').setValue(dataObject[i].url)
      //           this.form.get('icon').setValue(dataObject[i].icon)
      //           this.form.get('title').setValue(dataObject[i].title)
      //           this.form.get('attributeDisabled').setValue(dataObject[i].attributeDisabled)
      //           this.form.get('divider').setValue(dataObject[i].divider)
      //           this.form.get('ParentIds').setValue(dataObject[i].ParentIds)
      //         }
      //       }
      //     }
      //   )
    } else {
      this.navigationService.getMenu()
        .subscribe(
          (data) => {
            console.log(data)
            // const dataObject = JSON.parse(data['_body'])
            // this.initialData = dataObject
            // this.form.get('title').setValue(false)
            // this.form.get('attributeDisabled').setValue(false)
            // this.form.get('divider').setValue(false)
          }
        )
    }
  }

  onDisabled() {
    if (this.title === 'view') {
      return true
    } else {
      return false
    }
  }

  isFieldInvalid(field: string) {
    const fieldControl = this.form.get(field);
    return fieldControl.invalid && (fieldControl.dirty || fieldControl.touched);
  }

  onSubmit() {
    let results = this.form.value
    console.log(results, 'ini lhoo')

    if (this.id) {
      // this.menuService.editData(this.id, results)
      //   .subscribe(
      //     (data) => {
      //       const dataObject = JSON.parse(data['_body'])
      //       this.router.navigate(['/base/cms-menu'])
      //     }
      //   )
    } else {
      // if (this.form.valid) {
      //   this.menuService.addData(results)
      //     .subscribe(
      //       (data) => {
      //         const dataObject = JSON.parse(data['_body'])
      //         this.router.navigate(['/base/cms-menu'])
      //       }
      //     )
      // } 
    }
  }
}
