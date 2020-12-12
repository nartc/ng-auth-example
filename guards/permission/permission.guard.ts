import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  UrlSegment,
} from '@angular/router';
import {
  PermissionNames,
  PermissionStateService,
  Privilege,
} from '@volt/common/permissions';
import { RedirectService } from '@volt/common/services';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PermissionGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    private readonly redirectService: RedirectService,
    private readonly permissionStateService: PermissionStateService,
  ) {}

  canActivate(next: ActivatedRouteSnapshot): Observable<boolean> {
    return this.hasPermission(next.data.permission);
  }

  canActivateChild(next: ActivatedRouteSnapshot): Observable<boolean> {
    const permissionData =
      next.data.permission || next.parent?.data?.permission;
    return this.hasPermission(permissionData);
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    return this.hasPermission(route.data.permission, segments);
  }

  private hasPermission(
    permissionData?: [PermissionNames, Privilege],
    segments: UrlSegment[] = [],
  ): Observable<boolean> {
    if (permissionData) {
      const [permission, privilege] = permissionData;
      return this.permissionStateService
        .hasPermission$(permission, privilege)
        .pipe(
          tap((hasPermission) => {
            if (!hasPermission) {
              // HACK: This is a hack since using Router cannot navigate to an
              // already activated outlet (marketing-signage-request is on the
              // same outlet as any other non-auth route). Using
              // window.location.href to force reload also makes sense for
              // unauthenticated user.
              if (
                permission === PermissionNames.SupplierSignageManage &&
                segments.length > 1
              ) {
                // If permission is suppliersignage.manage, then it is the
                // Request Detail route.
                window.location.href = `${
                  window.location.origin
                }/marketing-signage-request/${segments.pop().path}`;
              } else if (
                permission === PermissionNames.SupplierSignageRequest
              ) {
                // If permission is suppliersignage.request, then it is the
                // Request route.
                window.location.href = `${window.location.origin}/marketing-signage-request/`;
              } else {
                this.redirectService.redirectToNotAuthorized();
              }
            }
          }),
        );
    }

    return of(true);
  }
}
