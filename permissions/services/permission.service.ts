import { Injectable } from '@angular/core';
import { PermissionClient } from '@volt/common/api/dashboard';
import { AuthStateService } from '@volt/common/auth';
import { logErrorAndReturn } from '@volt/common/utilities/rx';
import { of } from 'rxjs';
import { PermissionStateService } from '../states/permission-state.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  constructor(
    private readonly permissionClient: PermissionClient,
    private readonly permissionStateService: PermissionStateService,
    private readonly authStateService: AuthStateService,
  ) {}

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

  loadPermissions(): void {
    if (this.authStateService.isAuthorized) {
      this.permissionClient
        .retrievePermissionsForUser()
        .pipe(logErrorAndReturn(() => of([])))
        .subscribe((permissions) => {
          this.permissionStateService.set({
            permissions,
            permissionsReady: true,
          });
        });
    } else {
      this.permissionStateService.reset(); // permissions: []
    }
  }
}
