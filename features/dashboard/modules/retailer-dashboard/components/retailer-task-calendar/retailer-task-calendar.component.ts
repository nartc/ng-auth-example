import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgZone,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  CalendarOptions,
  DatesSetArg,
  EventClickArg,
  EventContentArg,
} from '@fullcalendar/angular';
import { ScheduleImportant } from '@volt/common/api/dashboard';
import { ApiResponseStatus } from '@volt/common/enums';
import { ApiResponse, CalendarTaskEvent } from '@volt/common/models';
import { debounceTime } from 'rxjs/operators';
import { RetailerDashboardStateService } from '../../services/retailer-dashboard-state.service';

@Component({
  selector: 'volt-retailer-task-calendar',
  templateUrl: './retailer-task-calendar.component.html',
  styleUrls: ['./retailer-task-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RetailerTaskCalendarComponent {
  @Input() walmartWeek: number;

  @Input() set taskEvents(value: ApiResponse<CalendarTaskEvent[]>) {
    this.taskEventsResponse = value;
    if (value.status === ApiResponseStatus.Success) {
      this.calendarOptions.events = value.data;
    }
  }

  @Output() viewEventDetail = new EventEmitter<{
    id: string;
    scheduleImportant: ScheduleImportant;
  }>();

  taskEventsResponse: ApiResponse<CalendarTaskEvent[]>;

  queryControl = new FormControl('');
  showAllControl = new FormControl(false);

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridWeek',
    themeSystem: 'bootstrap4',
    eventTextColor: '#000',
    firstDay: -1,
    eventDisplay: 'block',
    dayMaxEventRows: true,
    eventContent: ({ event }) => ({
      html: event.title.replace(/\n/g, '<br/>'),
    }),
    eventClick: this.showDetail.bind(this),
    eventClassNames: ({ event }: EventContentArg): string => {
      if (event.extendedProps.complete) {
        return 'line-through event-completed';
      }

      return `event-scheduleImportant-${event.extendedProps.scheduleImportant}`;
    },
    datesSet: this.viewChanged.bind(this),
  };

  constructor(
    private readonly ngZone: NgZone,
    readonly retailerDashboardStateService: RetailerDashboardStateService,
  ) {
    retailerDashboardStateService.connect(
      'calendarFilterQuery',
      this.queryControl.valueChanges.pipe(debounceTime(250)),
    );
    retailerDashboardStateService.connect(
      'isShowAllEvents',
      this.showAllControl.valueChanges.pipe(debounceTime(250)),
    );
  }

  private showDetail({ event }: EventClickArg) {
    // TODO: for some reason, showDetail event is invoked outside of Zone
    this.ngZone.run(() => {
      this.viewEventDetail.emit({
        id: event.id,
        scheduleImportant: event.extendedProps.scheduleImportant,
      });
    });
  }

  private viewChanged({ view: { activeStart, activeEnd } }: DatesSetArg) {
    this.calendarOptions.events = [];
    this.retailerDashboardStateService.set({
      calendarStart: activeStart,
      calendarEnd: activeEnd,
    });
  }
}
