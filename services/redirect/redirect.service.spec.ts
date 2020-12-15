import { Component } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { RedirectService } from './redirect.service';

@Component({
  selector: 'volt-dummy',
  template: `
    dummy
  `,
})
class DummyComponent {}

@Component({
  selector: 'volt-login',
  template: `
    login
  `,
})
class LoginComponent {}

describe('RedirectService', () => {
  let service: RedirectService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: '', redirectTo: 'dummy', pathMatch: 'full' },
          {
            path: 'login',
            component: LoginComponent,
          },
          { path: 'dummy', component: DummyComponent },
        ]),
      ],
      declarations: [LoginComponent, DummyComponent],
    });
    service = TestBed.inject(RedirectService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it(
    'should short-circuit if redirectToLogin is invoked on route /login',
    waitForAsync(() => {
      router.navigate(['/login']).then(() => {
        const spied = jest.spyOn(router, 'navigate');
        service.redirectToLogin();
        expect(spied).not.toHaveBeenCalled();
      });
    }),
  );

  it(
    'should navigate to /login',
    waitForAsync(() => {
      router.navigate(['/dummy']).then(() => {
        const spied = jest.spyOn(router, 'navigate');
        service.redirectToLogin();
        expect(spied).toHaveBeenCalledTimes(1);
      });
    }),
  );

  it('should navigate to /not-authorized', () => {
    const spied = jest
      .spyOn(router, 'navigate')
      .mockImplementationOnce(() => Promise.resolve(true));
    service.redirectToNotAuthorized();
    expect(spied).toHaveBeenCalledWith(['/not-authorized']);
  });
});
