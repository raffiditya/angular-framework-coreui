export function NormalizeFlag(form: any) {
  let copiedFormValue = Object.assign({}, form.value);
  Object.keys(copiedFormValue).forEach(key => {
    const value = copiedFormValue[key];
    if (typeof value === 'boolean') {
      copiedFormValue[key] = value ? 'Y' : 'N';
    }
  });

  return copiedFormValue;
}

export class bar {}
