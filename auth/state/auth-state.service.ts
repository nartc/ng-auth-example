import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { UserInformation } from '@volt/common/api/dashboard';
import { FieldGroupType } from '@volt/common/enums';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

export interface AuthState {
  refreshToken: string;
  refreshTokenExpiry: Date;
  token: string;
  tokenExpiry: Date;
  user: UserInformation;
  checkAccountHideTransaction: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthStateService extends RxState<AuthState> {
  token$ = this.select('token');
  tokenExpiry$ = this.select('tokenExpiry');
  refreshToken$ = this.select('refreshToken');
  currentUser$ = this.select('user');
  isAuthorized$ = this.token$.pipe(map(Boolean));
  sideNavAuthInfo$ = combineLatest([
    this.currentUser$,
    this.select('checkAccountHideTransaction'),
  ]).pipe(
    map(([user, checkAccountHideTransaction]) => {
      // TODO(chau): accountTypeId
      const fieldGroupType = user.account.fieldGroupType;
      return {
        hideLocationsOrServiceDeployments:
          checkAccountHideTransaction && user.roles === 'Provider Admin',
        hideSuppliers:
          fieldGroupType === FieldGroupType.DSD ||
          fieldGroupType === FieldGroupType.Specialty ||
          fieldGroupType === FieldGroupType.SRT,
      };
    }),
  );

  get isAuthorized(): boolean {
    return !!this.get().token;
  }

  reset(): void {
    this.set({
      refreshToken: '',
      refreshTokenExpiry: null,
      token: '',
      tokenExpiry: null,
      user: null,
      checkAccountHideTransaction: false,
    });
  }
}
