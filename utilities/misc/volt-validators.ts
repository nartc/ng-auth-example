import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { of } from 'rxjs';

type ValidateFnCallback<T> = (self: FormControl, target: FormControl) => T;

const watchControl = <T extends ValidatorFn = ValidatorFn>(
  targetControlName: string,
  validate: ValidateFnCallback<ReturnType<T>>,
) => {
  let target: FormControl = null;
  return (control: FormControl) => {
    const form = control.root as FormGroup;
    let temp: FormControl;
    if (
      !form ||
      !form.controls ||
      !(temp = form.get(targetControlName) as FormControl)
    ) {
      return of(null);
    }

    if (target !== temp) {
      target = temp;
      target.valueChanges.subscribe(() =>
        control.updateValueAndValidity({ onlySelf: true }),
      );
    }
    return validate(control, target);
  };
};

const EMAIL_REGEX_WITH_DOMAIN = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;
const MOBILE_TEN_DIGIT = /^\(?\d{3}\)? *-? *\d{3} *-? *\d{4}$/;

export class VoltValidators {
  static isEmail(control: AbstractControl): ValidationErrors | null {
    if (control?.value == null) {
      return null;
    }

    return EMAIL_REGEX_WITH_DOMAIN.test(control.value)
      ? null
      : { isEmail: true };
  }

  static isMobile(control: AbstractControl): ValidationErrors | null {
    if (control?.value == null) {
      return null;
    }

    return MOBILE_TEN_DIGIT.test(control.value) ? null : { isMobile: true };
  }

  static isEmailOrMobile(control: AbstractControl): ValidationErrors | null {
    if (control?.value == null) {
      return null;
    }

    const errors = control.value.includes('@')
      ? VoltValidators.isEmail(control)
      : VoltValidators.isMobile(control);
    return errors === null ? null : { isEmailOrMobile: true };
  }
}
