import {
  HTTP_INTERCEPTORS,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SwaggerException } from '@volt/common/api/dashboard';
import { RedirectService } from '@volt/common/services';
import { LuxonUtil } from '@volt/common/utilities/misc';
import { combineLatest, concat, defer, Observable, throwError } from 'rxjs';
import { catchError, mergeMap, retryWhen, take } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';
import { AuthStateService } from '../state/auth-state.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private allowed = ['/token/refresh', '/assets'];

  constructor(
    private readonly authStateService: AuthStateService,
    private readonly authService: AuthService,
    private readonly redirectService: RedirectService,
  ) {}

  private static addToken(req: HttpRequest<unknown>, token: unknown) {
    return req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
  }

  private refreshToClonedRequest(req: HttpRequest<unknown>, next: HttpHandler) {
    return concat(
      this.authService.refreshToken(), // refresh token API Call
      this.newTokenToClonedRequest(req, next), // req = current request going out
    );
  }

  private newTokenToClonedRequest(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ) {
    return this.authStateService.token$.pipe(
      mergeMap((newToken) =>
        next.handle(AuthInterceptor.addToken(req, newToken)),
      ),
    );
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    if (this.allowed.some((url) => request.url.includes(url))) {
      // Allowed URLs do not need bearer token
      return next.handle(request);
    }

    let hasRetried = false;
    return combineLatest([
      this.authStateService.token$,
      this.authStateService.tokenExpiry$,
    ]).pipe(
      take(1),
      mergeMap(([token, expiry]) => {
        if (!token) {
          // No token, just forward the request
          return next.handle(request);
        }

        const cloned = AuthInterceptor.addToken(request, token);
        return defer(() => {
          if (expiry && LuxonUtil.isInThePast(expiry)) {
            return this.refreshToClonedRequest(request, next) as Observable<
              HttpEvent<unknown>
            >;
          }

          return next.handle(cloned).pipe(
            retryWhen((errObs) =>
              errObs.pipe(
                mergeMap((err: SwaggerException) => {
                  if (err.status === 401 && !hasRetried) {
                    hasRetried = true;
                    return this.refreshToClonedRequest(
                      request,
                      next,
                    ) as Observable<HttpEvent<unknown>>;
                  }
                  return throwError(err);
                }),
              ),
            ),
          );
        }).pipe(
          catchError((err) => {
            if (SwaggerException.isSwaggerException(err)) {
              if (err.status === 401) {
                this.authService.logout().subscribe({
                  complete: () => {
                    this.redirectService.redirectToLogin();
                  },
                });
              } else if (err.status === 403) {
                this.redirectService.redirectToNotAuthorized();
              }
            }

            return throwError(err);
          }),
        );
      }),
    );
  }
}

export const authInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true,
};
