import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { EffectivePermissionViewModel } from '@volt/common/api/dashboard';
import { Observable, of } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { Privilege } from '..';
import { PermissionNames } from '../permission-names';

export interface PermissionState {
  permissions: EffectivePermissionViewModel[];
  permissionsReady: boolean;
}

@Injectable({ providedIn: 'root' })
export class PermissionStateService extends RxState<PermissionState> {
  currentPermissions$ = this.select('permissions');
  permissionReady$ = this.select('permissionsReady');

  reset(): void {
    this.set({ permissions: [], permissionsReady: false });
  }

  /**
   * [
   *  {
   *    permissionId: 'accounts.manage',
   *    activity: 15 (full CRUD, 1 + 2 + 4 +8)
   *  },
   *  {
   *    permissionId: 'dashboard.manage',
   *    activity: 1 (READ)
   *  }
   * ]
   */
  // 3rd party: KeyCloak, Auth0, etc...
  // privilege: 1 (READ, 1), 2 (CREATE, 10), 4 (UPDATE, 100), 8 (DELETE, 1000)
  hasPermission$(
    permissionToCheck: PermissionNames, // accounts.manage
    privilege: Privilege, // 2
  ): Observable<boolean> {
    if (permissionToCheck == null || privilege == null) {
      return of(true);
    }

    return this.currentPermissions$.pipe(
      map((permissions) =>
        permissions.some(
          (permission) =>
            permission.permissionId === permissionToCheck && // accounts.manage === accounts.manage
            (permission.activity & privilege) === privilege, // (15 & 2) === 2
        ),
      ),
      take(1),
    );
  }

  hasPermission(
    permissionToCheck: PermissionNames,
    privilege: Privilege,
  ): boolean {
    let hasPermission = false;
    this.hasPermission$(permissionToCheck, privilege).subscribe((value) => {
      hasPermission = value;
    });
    return hasPermission;
  }

  hasPermissionForLocation$(
    permissionToCheck: PermissionNames,
    privilege: Privilege,
    locationId: number,
  ): Observable<boolean> {
    if (permissionToCheck == null || privilege == null || locationId == null) {
      return of(true);
    }

    return this.currentPermissions$.pipe(
      map((permissions) => {
        return permissions.some(
          (permission) =>
            (permission.locationId === null ||
              permission.locationId === locationId) &&
            permission.permissionId === permissionToCheck &&
            (permission.activity & privilege) === privilege,
        );
      }),
      take(1),
    );
  }

  hasPermissionForLocation(
    permissionToCheck: PermissionNames,
    privilege: Privilege,
    locationId: number,
  ): boolean {
    let permission = false;
    this.hasPermissionForLocation$(
      permissionToCheck,
      privilege,
      locationId,
    ).subscribe((value) => {
      permission = value;
    });
    return permission;
  }
}
