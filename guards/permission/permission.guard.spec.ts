import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { PermissionStateService } from '@volt/common/permissions';
import { RedirectService } from '@volt/common/services';
import { forkJoin } from 'rxjs';

import { PermissionGuard } from './permission.guard';

describe('PermissionGuard', () => {
  let guard: PermissionGuard;
  let permissionService: PermissionStateService;
  let redirectService: RedirectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PermissionGuard,
        {
          provide: RedirectService,
          useValue: { redirectToNotAuthorized: jest.fn() },
        },
        {
          provide: PermissionStateService,
          useValue: { hasPermission$: jest.fn() },
        },
      ],
    });
    guard = TestBed.inject(PermissionGuard);
    permissionService = TestBed.inject(PermissionStateService);
    redirectService = TestBed.inject(RedirectService);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should canActivate/canActivateChild return true if permissionData is null', () => {
    const spiedHasPermission$ = jest.spyOn(permissionService, 'hasPermission$');
    const spiedRedirect = jest.spyOn(
      redirectService,
      'redirectToNotAuthorized',
    );
    const snapshot = new ActivatedRouteSnapshot();
    defineParentGetter(snapshot, null);
    snapshot.data = { permission: null };

    forkJoin([
      guard.canActivate(snapshot),
      guard.canActivateChild(snapshot),
    ]).subscribe(([canActivated, canActivatedChild]) => {
      expect(canActivated).toEqual(true);
      expect(canActivatedChild).toEqual(true);
      expect(spiedHasPermission$).not.toHaveBeenCalled();
      expect(spiedRedirect).not.toHaveBeenCalled();
    });
  });

  // TODO(chau): finish permission guard unit test

  function defineParentGetter(
    snapshot: ActivatedRouteSnapshot,
    parent: ActivatedRouteSnapshot | null,
  ): void {
    Object.defineProperty(snapshot, 'parent', {
      get(): ActivatedRouteSnapshot | null {
        return parent;
      },
    });
  }
});
