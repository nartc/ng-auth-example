import {
  Directive,
  EmbeddedViewRef,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Privilege } from '../../enums/privilege.enum';
import { PermissionNames } from '../../permission-names';
import { PermissionStateService } from '../../states/permission-state.service';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[permission]', // <input type='text' formControlName='apiKey' *permissions=['accounts.manage.apikey', 4]/>
})
export class PermissionDirective {
  private readonly _thenTemplateRef: TemplateRef<unknown> | null = null;
  private _thenViewRef: EmbeddedViewRef<unknown> | null = null;
  private _elseTemplateRef: TemplateRef<unknown> | null = null;
  private _elseViewRef: EmbeddedViewRef<unknown> | null = null;
  private _hasPermission = false;
  private _isConditionPassed = false;

  constructor(
    private readonly permissionStateService: PermissionStateService,
    private readonly viewRef: ViewContainerRef,
    private readonly templateRef: TemplateRef<unknown>,
  ) {
    this._thenTemplateRef = this.templateRef;
  }

  @Input() set permission(
    value: [keyof typeof PermissionNames, keyof typeof Privilege, boolean?],
  ) {
    if (value == null || !value.length) {
      this._hasPermission = true;
      this._isConditionPassed = true;
    } else {
      // *permissions=['accounts.manage.apikey', 4];else noPermission
      // <ng-template #noPermission></ng-template>
      const [permission, privilege, condition = true] = value;
      this._hasPermission = this.permissionStateService.hasPermission(
        PermissionNames[permission],
        Privilege[privilege],
      );
      this._isConditionPassed = condition;
    }

    this._updateView();
  }

  @Input() set permissionElse(templateRef: TemplateRef<unknown>) {
    this._elseTemplateRef = templateRef;
    this._elseViewRef = null;
    this._updateView();
  }

  private _updateView() {
    if (this._isConditionPassed && this._hasPermission) {
      if (!this._thenViewRef) {
        this.viewRef.clear();
        this._elseViewRef = null;
        if (this._thenTemplateRef) {
          this._thenViewRef = this.viewRef.createEmbeddedView(
            this._thenTemplateRef,
            {
              hasPermission: this._hasPermission,
              condition: this._isConditionPassed,
            },
          );
          this._thenViewRef.markForCheck();
        }
      }
    } else {
      if (!this._elseViewRef) {
        this.viewRef.clear();
        this._thenViewRef = null;
        if (this._elseTemplateRef) {
          this._elseViewRef = this.viewRef.createEmbeddedView(
            this._elseTemplateRef,
            {
              hasPermission: this._hasPermission,
              condition: this._isConditionPassed,
            },
          );
          this._elseViewRef.markForCheck();
        }
      }
    }
  }
}
