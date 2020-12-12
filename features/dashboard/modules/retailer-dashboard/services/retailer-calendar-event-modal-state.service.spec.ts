import { TestBed } from '@angular/core/testing';

import { RetailerCalendarEventModalStateService } from './retailer-calendar-event-modal-state.service';

describe('RetailerCalendarEventModalStateService', () => {
  let service: RetailerCalendarEventModalStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RetailerCalendarEventModalStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
