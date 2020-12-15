import { Directive, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Directive()
export abstract class BaseFormField {
  @Input() control: FormControl;
  @Input() controlId: string;
  @Input() filterDisplayLabel: string;
}
