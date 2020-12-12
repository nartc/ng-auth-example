import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AuthInterceptor,
  authInterceptorProvider,
  AuthService,
  AuthStateService,
} from '@volt/common/auth';
import { RedirectService } from '@volt/common/services';
import { LuxonUtil } from '@volt/common/utilities/misc';
import { of } from 'rxjs';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;
  let service: AuthService;
  let stateService: AuthStateService;
  let httpTestingController: HttpTestingController;

  const mockedRedirectService = jest.fn();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        AuthStateService,
        { provide: RedirectService, useValue: mockedRedirectService },
        AuthService,
        authInterceptorProvider,
      ],
    });
    const httpInterceptors = TestBed.inject(HTTP_INTERCEPTORS);
    interceptor = httpInterceptors.find(
      (value) => value instanceof AuthInterceptor,
    ) as AuthInterceptor;
    httpTestingController = TestBed.inject(HttpTestingController);
    stateService = TestBed.inject(AuthStateService);
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should not append authorization header if there is no token', () => {
    stateService.token$ = of(null);
    stateService.tokenExpiry$ = of(null);

    service.login('email', 'pw').subscribe();

    const httpRequest = httpTestingController.expectOne({
      url: 'http://localhost:5301/client/v1/security/token',
      method: 'POST',
    });
    expect(httpRequest.request.headers.has('Authorization')).toEqual(false);
  });

  it('should append authorization header if there is token', () => {
    stateService.token$ = of('token');
    stateService.tokenExpiry$ = of(null);

    service.login('email', 'pw').subscribe();

    const httpRequest = httpTestingController.expectOne({
      url: 'http://localhost:5301/client/v1/security/token',
      method: 'POST',
    });

    expect(httpRequest.request.headers.has('Authorization')).toEqual(true);
    expect(httpRequest.request.headers.get('Authorization')).toEqual(
      'Bearer token',
    );
  });

  it('should attempt to refresh token if token is expired', () => {
    stateService.token$ = of('token');
    stateService.tokenExpiry$ = of(LuxonUtil.fromDateToDate('2020-01-01'));

    const spiedRefreshToken = jest
      .spyOn(service, 'refreshToken')
      .mockReturnValue(of({}));

    service.login('email', 'pw').subscribe();

    const httpRequest = httpTestingController.expectOne({
      url: 'http://localhost:5301/client/v1/security/token',
      method: 'POST',
    });

    expect(spiedRefreshToken).toHaveBeenCalled();
    expect(httpRequest.request.headers.has('Authorization')).toEqual(true);
    expect(httpRequest.request.headers.get('Authorization')).toEqual(
      'Bearer token',
    );
  });
});
