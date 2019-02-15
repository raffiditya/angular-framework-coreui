import { Component, OnInit } from '@angular/core';
import { createNumberMask } from "text-mask-addons/dist/textMaskAddons";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  templateUrl: './forms-ng.component.html'
})
export class FormsNgComponent implements OnInit {

  ccMask = [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/];
  rupiahMask = createNumberMask({
    prefix: '',
    suffix: '',
    thousandsSeparatorSymbol: '.',
    integerLimit: 15
  });
  cities = [
    {provId: 1, name: 'Jakarta'},
    {provId: 2, name: 'Bandung'},
    {provId: 3, name: 'Tangerang'},
  ];
  minDate = new Date(1960, 0, 0);
  maxDate = new Date();
  defaultDate = new Date(1992, 0, 12);

  advanceForm = this.fb.group({
    creditCard: ['', [Validators.required, Validators.pattern(/^(\d{4} \d{4} \d{4} \d{4})$/)]],
    amount: [''],
    city: ['', Validators.required],
    birthDate: [this.defaultDate, Validators.required]
  });

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
  }

  isFieldInvalid(field: string) {
    const fieldControl = this.advanceForm.get(field);
    return fieldControl.invalid && (fieldControl.dirty || fieldControl.touched);
  }

  private validateAllFormFields(formGroup: FormGroup) {         //{1}
    Object.keys(formGroup.controls).forEach(field => {  //{2}
      const control = formGroup.get(field);             //{3}
      if (control instanceof FormControl) {             //{4}
        control.markAsTouched({onlySelf: true});
      } else if (control instanceof FormGroup) {        //{5}
        this.validateAllFormFields(control);            //{6}
      }
    });
  }

  onSubmit() {
    this.advanceForm.markAsTouched();
    if (this.advanceForm.valid) {
      console.log('form submitted');
    } else {
      this.validateAllFormFields(this.advanceForm);
    }
  }

}
