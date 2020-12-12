import { TestBed } from '@angular/core/testing';

import { RetailerDashboardService } from './retailer-dashboard.service';

describe('RetailerDashboardService', () => {
  let service: RetailerDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RetailerDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
