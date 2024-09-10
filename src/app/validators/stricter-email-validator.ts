import { AbstractControl, ValidationErrors } from '@angular/forms';

export function stricterEmailValidator(control: AbstractControl): ValidationErrors | null {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(control.value) ? null : { invalidEmail: true };
}
