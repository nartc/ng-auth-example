import { TestBed } from '@angular/core/testing';
import { AuthStateService } from '@volt/common/auth';
import { AuthenticatedGuard } from '@volt/common/guards';
import { of } from 'rxjs';

describe('AuthenticatedGuard', () => {
  let guard: AuthenticatedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthenticatedGuard,
        { provide: AuthStateService, useValue: { isAuthorized$: of(false) } },
      ],
    });
  });

  it('should be created', () => {
    guard = TestBed.inject(AuthenticatedGuard);
    expect(guard).toBeTruthy();
  });

  it('should return false if isAuthorized is false', () => {
    guard = TestBed.inject(AuthenticatedGuard);
    guard.canActivate().subscribe((result) => {
      expect(result).toBe(false);
    });
    guard.canLoad().subscribe((result) => {
      expect(result).toBe(false);
    });
    guard.canActivateChild().subscribe((result) => {
      expect(result).toBe(false);
    });
  });

  it('should return true if isAuthorized is true', () => {
    TestBed.overrideProvider(AuthStateService, {
      useValue: { isAuthorized$: of(true) },
    });
    guard = TestBed.inject(AuthenticatedGuard);
    guard.canActivate().subscribe((result) => {
      expect(result).toBe(true);
    });
    guard.canLoad().subscribe((result) => {
      expect(result).toBe(true);
    });
    guard.canActivateChild().subscribe((result) => {
      expect(result).toBe(true);
    });
  });
});
