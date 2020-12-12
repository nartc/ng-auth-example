import { TestBed } from '@angular/core/testing';

import { RetailerDashboardStateService } from './retailer-dashboard-state.service';

describe('RetailerDashboardStateService', () => {
  let service: RetailerDashboardStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RetailerDashboardStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
