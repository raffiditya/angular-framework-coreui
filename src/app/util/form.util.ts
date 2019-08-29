import { FormGroup } from "@angular/forms";

export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({
        mustMatch: true
      });
    } else {
      matchingControl.setErrors(null);
    }
  }
}

export function normalizeFlag(form: any) {
  let copiedFormValue = Object.assign({}, form.value);
  Object.keys(copiedFormValue).forEach(key => {
    const value = copiedFormValue[key];
    if (typeof value === 'boolean') {
      copiedFormValue[key] = value ? 'Y' : 'N';
    }
  });

  return copiedFormValue;
}
