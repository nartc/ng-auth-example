import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ScheduleImportant } from '@volt/common/api/dashboard';
import { RetailerCalendarEventModalStateService } from '../../services/retailer-calendar-event-modal-state.service';

@Component({
  selector: 'volt-retailer-calendar-event-modal',
  templateUrl: './retailer-calendar-event-modal.component.html',
  styleUrls: ['./retailer-calendar-event-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RetailerCalendarEventModalStateService],
})
export class RetailerCalendarEventModalComponent implements OnInit {
  taskDetailVm$ = this.retailerCalendarEventModalStateService.vm$;
  scheduleImportant = ScheduleImportant;

  constructor(
    private readonly retailerCalendarEventModalStateService: RetailerCalendarEventModalStateService,
    private readonly dynamicDialogRef: DynamicDialogRef,
    private readonly dynamicDialogConfig: DynamicDialogConfig,
  ) {}

  ngOnInit(): void {
    const { id, scheduleImportant } = this.dynamicDialogConfig.data;
    this.retailerCalendarEventModalStateService.updateTaskDetailFilter(
      id,
      scheduleImportant,
    );
  }

  onClose() {
    this.dynamicDialogRef.close();
  }
}
