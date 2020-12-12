import { TestBed } from '@angular/core/testing';
import { RoleClient } from '@volt/common/api/dashboard';
import { AuthStateService } from '@volt/common/auth';
import { of } from 'rxjs';
import { skip } from 'rxjs/operators';

import { DashboardLandingService } from './dashboard-landing.service';

describe('DashboardLandingService', () => {
  let service: DashboardLandingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DashboardLandingService,
        { provide: RoleClient, useValue: { getLandingPage: jest.fn() } },
        {
          provide: AuthStateService,
          useValue: { currentUser$: of({ roles: 'roles' }) },
        },
      ],
    });
    service = TestBed.inject(DashboardLandingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load dashboard with currentUser', () => {
    const spiedGetLandingPage = jest
      .spyOn(TestBed.inject(RoleClient), 'getLandingPage')
      .mockReturnValueOnce(of('/route'));
    service
      .loadDashboard()
      .pipe(skip(1))
      .subscribe((response) => {
        expect(response.data).toEqual('/route');
        expect(spiedGetLandingPage).toHaveBeenCalledWith('roles');
      });
  });
});
