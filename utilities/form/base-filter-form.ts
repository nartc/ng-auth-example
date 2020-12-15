import { Directive } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Disposable } from '../misc';
import { Form } from '../types';

@Directive()
export abstract class BaseFilterForm<
  TModel extends {} = unknown,
  TForm = Form<TModel>
> extends Disposable {
  form: FormGroup;
  private $submitClick = new Subject<null>();

  abstract initForm(): void;

  get controls(): TForm {
    return (this.form.controls as unknown) as TForm;
  }

  submitClick() {
    this.$submitClick.next();
  }

  protected initFormSharedValues(
    cb: (formValues: { previous: TModel; current: TModel }) => void,
  ) {
    // this.form.sharedValueChanges = this.form.valueChanges.pipe(
    //   OperatorUtils.mapToFormSharedValue(this.form),
    //   OperatorUtils.takeUntilDisposed(this),
    // );
    // this.form.sharedValueChanges.subscribe(cb);
  }

  protected initSubmitClickSubscription(cb: () => void) {
    this.$submitClick
      .asObservable()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(cb);
  }
}
