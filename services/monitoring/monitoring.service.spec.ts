import { TestBed } from '@angular/core/testing';
import { APP_INSIGHTS } from '@volt/common/services';

import { MonitoringService } from './monitoring.service';

describe('MonitoringService', () => {
  let service: MonitoringService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MonitoringService,
        {
          provide: APP_INSIGHTS,
          useValue: {
            trackPageView: jest.fn(),
            loadAppInsights: jest.fn(),
            trackException: jest.fn(),
            setAuthenticatedUserContext: jest.fn(),
          },
        },
      ],
    });
  });

  it('should be created and log to console if ApplicationInsights is null', () => {
    const spiedConsoleLog = spyOn(console, 'log');
    TestBed.overrideProvider(APP_INSIGHTS, { useValue: null });
    service = TestBed.inject(MonitoringService);
    expect(service).toBeTruthy();
    expect(spiedConsoleLog).toHaveBeenCalledWith(
      'Application insights not configured for this environment',
    );
  });

  it('should logApiException', () => {
    const error = new Error('error message');
    const spied = jest.spyOn(TestBed.inject(APP_INSIGHTS), 'trackException');
    service = TestBed.inject(MonitoringService);
    service.logApiException(error);
    expect(spied).toHaveBeenCalled();
  });

  it('should logError', () => {
    const error = new Error('error message');
    const spied = jest.spyOn(TestBed.inject(APP_INSIGHTS), 'trackException');
    service = TestBed.inject(MonitoringService);
    service.logError(error);
    expect(spied).toHaveBeenCalled();
  });

  it('should setAuthenticatedUserContext', () => {
    const spied = jest.spyOn(
      TestBed.inject(APP_INSIGHTS),
      'setAuthenticatedUserContext',
    );
    service = TestBed.inject(MonitoringService);
    service.setAuthenticatedUserId('1', '2');
    expect(spied).toHaveBeenCalledWith('1', '2', true);
  });
});
