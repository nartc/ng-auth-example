import { Injectable } from '@angular/core';
import {
  AccountsClient,
  ApiError,
  ApiErrorOfRequestTokenErrors,
  RequestTokenErrors,
  SecurityClient,
  SwaggerException,
  TokenRequest,
} from '@volt/common/api/dashboard';
import { ApiResponse } from '@volt/common/models';
import { LocalStorageService, RedirectService } from '@volt/common/services';
import { LuxonUtil } from '@volt/common/utilities/misc';
import { handleApiResponse } from '@volt/common/utilities/rx';
import {
  EMPTY,
  forkJoin,
  Observable,
  of,
  pipe,
  Subscription,
  throwError,
  timer,
} from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { AuthStateService } from '../state/auth-state.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private jwtSubscription: Subscription;
  private afterRequestToken = () =>
    pipe(
      tap<TokenRequest>(({ refreshToken, expiresAt }) => {
        this.localStorageService.set('rtok', refreshToken);
        this.setupRefreshTimer(expiresAt);
      }),
      switchMap((tokenRequest) => {
        const {
          token,
          refreshToken,
          expiresAt,
          refreshExpiresAt,
          user,
        } = tokenRequest;
        this.authStateService.set({
          token,
          refreshToken: refreshToken!,
          tokenExpiry: LuxonUtil.fromDateToDate(expiresAt),
          refreshTokenExpiry: LuxonUtil.fromDateToDate(refreshExpiresAt),
          user,
        });
        return forkJoin([
          of(tokenRequest),
          this.accountsClient.checkAccountHideTransaction(
            tokenRequest.user?.accountId,
          ),
        ]);
      }),
      map(([tokenRequest, checkAccountHideTransaction]) => {
        this.authStateService.set({ checkAccountHideTransaction });
        return tokenRequest;
      }),
    );

  constructor(
    private readonly authStateService: AuthStateService,
    private readonly localStorageService: LocalStorageService,
    private readonly redirectService: RedirectService,
    private readonly securityClient: SecurityClient,
    private readonly accountsClient: AccountsClient,
  ) {}

  login(
    emailOrMobile: string,
    password: string,
  ): Observable<ApiResponse<TokenRequest>> {
    return handleApiResponse(
      this.securityClient
        .requestToken({ emailOrMobile, password })
        .pipe(this.afterRequestToken()),
      null,
      (err) => {
        const error = err as ApiErrorOfRequestTokenErrors & ApiError;
        switch (error.errorKey) {
          case RequestTokenErrors.InvalidCredentials:
            return 'Username or Password incorrect. Please note in order to use the phone number, you must have it configured by your admin';
          case RequestTokenErrors.UserIsNotActive:
            return 'User account has been deactivated';
          case RequestTokenErrors.PasswordExpired:
            return 'Password has expired';
          default:
            return error.error;
        }
      },
    );
  }

  logout(): Observable<never> {
    this.localStorageService.remove('rtok');
    this.authStateService.reset();
    this.jwtSubscription?.unsubscribe();
    return EMPTY;
  }

  retrieveTokenOnPageLoad(): void {
    this.refreshToken().subscribe();
  }

  refreshToken(): Observable<never> | Observable<TokenRequest> {
    const token = this.localStorageService.get('rtok');
    if (!token) {
      this.authStateService.reset();
      this.redirectService.redirectToLogin();
      return EMPTY;
    }

    return this.securityClient.refresh({ token }).pipe(
      catchError((err: SwaggerException) => {
        if (err.status === 401) {
          // do something if refreshToken is unauthorized.
          // This means there's no refreshToken in localStorage
          this.redirectService.redirectToLogin();
        }
        // do more
        this.authStateService.reset();
        return throwError(err);
      }),
      this.afterRequestToken(),
    );
  }

  private setupRefreshTimer(expiresAt: Date) {
    const expiry = LuxonUtil.fromDate(expiresAt);
    const diffInMilli = expiry.minus({ minute: 1 }).diffNow().milliseconds;
    // Reset the timer if there's already one running
    this.jwtSubscription?.unsubscribe();

    // Setup timer
    this.jwtSubscription = timer(diffInMilli)
      .pipe(switchMap(this.refreshToken.bind(this)))
      .subscribe();
  }
}
