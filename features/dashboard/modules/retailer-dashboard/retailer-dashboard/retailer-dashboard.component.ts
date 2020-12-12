import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScheduleImportant } from '@volt/common/api/dashboard';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { RetailerCalendarEventModalComponent } from '../modals/retailer-calendar-event-modal/retailer-calendar-event-modal.component';
import {
  RetailerDashboardStateService,
  RetailerDashboardVm,
} from '../services/retailer-dashboard-state.service';

@Component({
  selector: 'volt-retailer-dashboard',
  templateUrl: './retailer-dashboard.component.html',
  styleUrls: ['./retailer-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RetailerDashboardStateService, DialogService],
})
export class RetailerDashboardComponent {
  vm$: Observable<RetailerDashboardVm> = this.retailerDashboardStateService.vm$;

  constructor(
    private readonly retailerDashboardStateService: RetailerDashboardStateService,
    private readonly dialogService: DialogService,
  ) {}

  onViewEventDetail(event: {
    id: string;
    scheduleImportant: ScheduleImportant;
  }) {
    this.dialogService.open(RetailerCalendarEventModalComponent, {
      data: event,
      modal: true,
      showHeader: false,
      styleClass: 'dialog-no-header',
    });
  }
}
