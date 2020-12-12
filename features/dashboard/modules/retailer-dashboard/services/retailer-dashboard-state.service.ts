import { Injectable, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RxState } from '@rx-angular/state';
import {
  ServiceTaskByPspModel,
  TopSupplierModel,
} from '@volt/common/api/dashboard';
import { defaultDateRangeSettings } from '@volt/common/constants';
import { ApiResponse, CalendarTaskEvent } from '@volt/common/models';
import {
  PermissionNames,
  PermissionStateService,
  Privilege,
} from '@volt/common/permissions';
import { TranslationService } from '@volt/common/translations';
import { vmFromLatest } from '@volt/common/utilities/rx';
import { Options } from 'highcharts';
import { SelectItem } from 'primeng/api';
import { combineLatest } from 'rxjs';
import {
  map,
  switchMap,
  switchMapTo,
  take,
  withLatestFrom,
} from 'rxjs/operators';
import { RetailerDashboardFilter } from '../models/retailer-dashboard-filter';
import { RetailerDashboardService } from './retailer-dashboard.service';

export interface RetailerDashboardVm {
  dateRange: string;
  walmartWeek: number;
  repsInStore: ApiResponse<number>;
  scheduledTaskCount: ApiResponse<number>;
  taskEvents: ApiResponse<CalendarTaskEvent[]>;
  serviceTasksByPsp: ApiResponse<{
    sortedByTotal: ServiceTaskByPspModel[];
    sortedByTime: ServiceTaskByPspModel[];
  }>;
  topSuppliers: ApiResponse<TopSupplierModel[]>;
}

export interface RetailerDashboardState {
  isDemo: boolean;
  isShowAllEvents: boolean;
  repsInStoreNotifier: boolean;
  calendarFilterQuery: string;
  rawTaskEvents: ApiResponse<CalendarTaskEvent[]>;
  calendarStart: Date;
  calendarEnd: Date;
  filter: RetailerDashboardFilter;
  dateRangeFilter: SelectItem;
  vm: RetailerDashboardVm;
}

@Injectable()
export class RetailerDashboardStateService extends RxState<
  RetailerDashboardState
> {
  vm$ = this.select('vm');
  filter$ = this.select('filter');
  isDemo$ = this.select('isDemo');
  dateRangeFilter$ = this.select('dateRangeFilter');

  dateRangeLabel$ = this.dateRangeFilter$.pipe(map((filter) => filter.label));
  departmentFilter$ = combineLatest([this.filter$, this.isDemo$]).pipe(
    map(([filter, isDemo]) => ({ filter, isDemo })),
  );
  tasksFilter$ = combineLatest([
    this.departmentFilter$,
    this.dateRangeFilter$,
  ]).pipe(
    map(([{ filter, isDemo }, dateRangeFilter]) => ({
      filter,
      isDemo,
      dateRangeFilter,
    })),
  );
  calendarFilter$ = combineLatest([
    this.departmentFilter$,
    this.select('isShowAllEvents'),
    this.select('calendarStart'),
    this.select('calendarEnd'),
  ]).pipe(
    map(([{ filter, isDemo }, isShowAll, start, end]) => ({
      filter,
      isDemo,
      isShowAll,
      start,
      end,
    })),
  );

  constructor(
    private readonly route: ActivatedRoute,
    private readonly translationService: TranslationService,
    private readonly retailerDashboardService: RetailerDashboardService,
    private readonly permissionStateService: PermissionStateService,
    private readonly ngZone: NgZone,
  ) {
    super();
    this.reset();
    this.connect('vm', this.vmEffect$);
    this.connect('rawTaskEvents', this.rawTaskEventsEffect$);
    this.connect('isDemo', this.isDemoDashboardEffect$);
  }

  getBarChartOptions(): Options {
    return {
      chart: {
        type: 'column',
        backgroundColor: 'transparent',
      },
      title: {
        text: null,
      },
      subtitle: {
        text: null,
      },
      xAxis: {
        type: 'category',
      },
      yAxis: {
        title: {
          text: null,
        },
      },
      credits: {
        enabled: false,
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            format: '{point.y:,.0f}',
          },
        },
      },
      tooltip: {
        pointFormat: `{point.name}: ${this.translationService.translate(
          'task',
        )}: <b>{point.y}</b>`,
        enabled: true,
      },
    };
  }

  getPieChartOptions(): Options {
    return {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        events: {
          drilldown: (e) => {
            this.ngZone.run(() => {
              e.target.setTitle({ text: e.point.name });
            });
          },
          drillup: (e) => {
            this.ngZone.run(() => {
              e.target.setTitle({ text: null });
            });
          },
        },
      },
      title: {
        text: null,
      },
      subtitle: {
        text: null,
      },
      tooltip: {
        pointFormat: `{point.name}: <b>{point.percentage:.1f}%</b> <br/> ${this.translationService.translate(
          'task',
        )}: <b>{point.y}</b>`,
        enabled: true,
      },
    };
  }

  reset() {
    const defaultDateRangeFilter = defaultDateRangeSettings.future[0];

    this.set({
      isShowAllEvents: false,
      repsInStoreNotifier: false,
      calendarFilterQuery: '',
      calendarStart: new Date(),
      calendarEnd: new Date(),
      dateRangeFilter: {
        label: defaultDateRangeFilter.labelTranslateKey
          ? `${this.translationService.translate(
              defaultDateRangeFilter.labelTranslateKey,
            )} ${defaultDateRangeFilter.label ?? ''}`
          : defaultDateRangeFilter.fullLabel,
        value: defaultDateRangeFilter.valueInDays,
      },
      filter: {
        sbu: null,
        departmentGroup: null,
        department: null,
      },
    });
  }

  clearDepartmentFilter() {
    this.set({
      filter: {
        sbu: null,
        departmentGroup: null,
        department: null,
      },
    });
  }

  updateDepartmentFilter(filter: RetailerDashboardFilter) {
    this.set({
      filter: {
        sbu: filter.sbu,
        departmentGroup: filter.departmentGroup,
        department: filter.department,
      },
    });
  }

  notifyRepsInStore() {
    this.set((state) => ({ repsInStoreNotifier: !state.repsInStoreNotifier }));
  }

  private get isDemoDashboardEffect$() {
    return this.route.url.pipe(
      withLatestFrom(
        this.permissionStateService.hasPermission$(
          PermissionNames.DemoRetailtainmentManage,
          Privilege.Read,
        ),
      ),
      map(
        ([segments, hasDemoPermission]) =>
          hasDemoPermission &&
          Boolean(segments?.[0]?.path?.includes('demo-dashboard')),
      ),
      take(1),
    );
  }

  private get rawTaskEventsEffect$() {
    return this.calendarFilter$.pipe(
      switchMap(({ filter, isDemo, isShowAll, start, end }) =>
        this.retailerDashboardService.getServiceTaskSummaryForRetailer(
          isDemo,
          filter,
          isShowAll,
          start,
          end,
        ),
      ),
    );
  }

  private get vmEffect$() {
    return vmFromLatest<RetailerDashboardVm>({
      dateRange: this.dateRangeLabel$,
      walmartWeek: this.select('calendarStart').pipe(
        switchMap((start) =>
          this.retailerDashboardService.getWalmartWeek(start),
        ),
        map((wmWeek) => wmWeek.week),
      ),
      repsInStore: this.select('repsInStoreNotifier').pipe(
        switchMapTo(this.isDemo$),
        switchMap((isDemo) =>
          this.retailerDashboardService.getRepsInStore(isDemo),
        ),
      ),
      scheduledTaskCount: this.tasksFilter$.pipe(
        switchMap(({ isDemo, filter, dateRangeFilter }) =>
          this.retailerDashboardService.getScheduledTaskCount(
            isDemo,
            filter,
            dateRangeFilter,
          ),
        ),
      ),
      taskEvents: combineLatest([
        this.select('rawTaskEvents'),
        this.select('calendarFilterQuery'),
      ]).pipe(
        map(([rawTaskEvents, filterQuery]) => {
          if (filterQuery) {
            return {
              ...rawTaskEvents,
              data: rawTaskEvents.data.filter(
                (task) =>
                  task.title
                    .toLowerCase()
                    .indexOf(filterQuery.toLowerCase().trim()) > -1,
              ),
            };
          }
          return rawTaskEvents;
        }),
      ),
      serviceTasksByPsp: this.tasksFilter$.pipe(
        switchMap(({ filter, isDemo, dateRangeFilter }) =>
          this.retailerDashboardService.getServiceTaskChartForRetailer(
            isDemo,
            filter,
            dateRangeFilter,
          ),
        ),
      ),
      topSuppliers: this.tasksFilter$.pipe(
        switchMap(({ filter, isDemo, dateRangeFilter }) =>
          this.retailerDashboardService.getSupplierTopList(
            isDemo,
            filter,
            dateRangeFilter,
          ),
        ),
      ),
    });
  }
}
