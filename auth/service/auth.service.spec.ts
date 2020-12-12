import { TestBed } from '@angular/core/testing';
import {
  AccountsClient,
  SecurityClient,
  TokenRequest,
} from '@volt/common/api/dashboard';
import { AuthStateService } from '@volt/common/auth';
import { LocalStorageService, RedirectService } from '@volt/common/services';
import { LuxonUtil } from '@volt/common/utilities/misc';
import { of } from 'rxjs';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let stateService: AuthStateService;

  const mockedTokenRequest: TokenRequest = {
    token: 'token',
    expiresAt: LuxonUtil.fromDateToDate('2020-01-01'),
    refreshToken: 'rtok',
    refreshExpiresAt: LuxonUtil.fromDateToDate('2020-01-01'),
    user: {},
    createdAt: LuxonUtil.fromDateToDate('2020-01-01'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthStateService,
        {
          provide: LocalStorageService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            remove: jest.fn(),
            isEnabled: jest.fn(),
          },
        },
        {
          provide: RedirectService,
          useValue: {
            redirectToLogin: jest.fn(),
          },
        },
        {
          provide: SecurityClient,
          useValue: {
            requestToken: jest.fn(),
            refresh: jest.fn(),
          },
        },
        {
          provide: AccountsClient,
          useValue: {
            checkAccountHideTransaction: jest.fn(),
          },
        },
        AuthService,
      ],
    });
    service = TestBed.inject(AuthService);
    stateService = TestBed.inject(AuthStateService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should login', () => {
    // mocked
    const spiedRequestToken = jest
      .spyOn(TestBed.inject(SecurityClient), 'requestToken')
      .mockReturnValue(of(mockedTokenRequest));
    const spiedCheckAccountHide = jest
      .spyOn(TestBed.inject(AccountsClient), 'checkAccountHideTransaction')
      .mockReturnValue(of(true));
    const spiedSet = jest.spyOn(stateService, 'set');
    const spiedLocalStorageSet = jest.spyOn(
      TestBed.inject(LocalStorageService),
      'set',
    );

    // act
    const email = 'aaa@mail.com';
    const password = '123456';
    service.login(email, password).subscribe();

    // assert
    expect(spiedRequestToken).toHaveBeenCalledWith({
      emailOrMobile: email,
      password,
    });
    expect(spiedLocalStorageSet).toHaveBeenCalledWith(
      'rtok',
      mockedTokenRequest.refreshToken,
    );
    expect(spiedSet).toHaveBeenCalled();
    expect(spiedCheckAccountHide).toHaveBeenCalled();
    expect(spiedSet).toHaveBeenCalled();
  });

  it('should logout', () => {
    const spied = jest.spyOn(stateService, 'set');
    const spiedRemove = jest.spyOn(
      TestBed.inject(LocalStorageService),
      'remove',
    );
    service.logout();
    expect(spiedRemove).toHaveBeenCalled();
    expect(spied).toHaveBeenCalled();
  });

  it('should refreshToken return EMPTY if there is no token in storage', () => {
    const observer = {
      next: jest.fn(),
      complete: jest.fn(),
    };
    jest
      .spyOn(TestBed.inject(LocalStorageService), 'get')
      .mockReturnValueOnce('');
    service.refreshToken().subscribe(observer);
    expect(observer.next).not.toHaveBeenCalled();
    expect(observer.complete).toHaveBeenCalled();
  });

  it('should refreshToken', () => {
    jest
      .spyOn(TestBed.inject(LocalStorageService), 'get')
      .mockReturnValueOnce('token');
    const spiedRefresh = jest
      .spyOn(TestBed.inject(SecurityClient), 'refresh')
      .mockReturnValue(of(mockedTokenRequest));
    const spiedCheckAccountHide = jest
      .spyOn(TestBed.inject(AccountsClient), 'checkAccountHideTransaction')
      .mockReturnValue(of(true));
    const spiedLocalStorageSet = jest.spyOn(
      TestBed.inject(LocalStorageService),
      'set',
    );
    const spiedSet = spyOn(stateService, 'set');
    service.refreshToken().subscribe();
    expect(spiedRefresh).toHaveBeenCalled();
    expect(spiedLocalStorageSet).toHaveBeenCalledWith(
      'rtok',
      mockedTokenRequest.refreshToken,
    );
    expect(spiedSet).toHaveBeenCalled();
    expect(spiedCheckAccountHide).toHaveBeenCalled();
    expect(spiedSet).toHaveBeenCalled();
  });
});
