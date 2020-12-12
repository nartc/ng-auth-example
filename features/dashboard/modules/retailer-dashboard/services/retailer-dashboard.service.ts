import { Injectable } from '@angular/core';
import {
  CountClient,
  DashboardFilter,
  RetailtainmentServiceTaskViewModel,
  ScheduleImportant,
  ServiceTaskByPspModel,
  ServiceTaskDashboardFilter,
  ServiceTaskModel,
  ServiceTasksClient,
  SupplierClient,
  TopSupplierModel,
  UtilitiesClient,
  WalmartWeek,
} from '@volt/common/api/dashboard';
import { ApiResponse, CalendarTaskEvent } from '@volt/common/models';
import { TranslationService } from '@volt/common/translations';
import { LuxonUtil } from '@volt/common/utilities/misc';
import { handleApiResponse } from '@volt/common/utilities/rx';
import { orderBy } from 'lodash-es';
import { SelectItem } from 'primeng/api';
import { defer, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { RetailerDashboardFilter } from '../models/retailer-dashboard-filter';

@Injectable({
  providedIn: 'root',
})
export class RetailerDashboardService {
  private loadedWalmartWeeks: { [key: string]: WalmartWeek } = {};

  constructor(
    private readonly countClient: CountClient,
    private readonly serviceTasksClient: ServiceTasksClient,
    private readonly utilitiesClient: UtilitiesClient,
    private readonly supplierClient: SupplierClient,
    private readonly translationService: TranslationService,
  ) {}

  getRepsInStore(isDemo: boolean): Observable<ApiResponse<number>> {
    return handleApiResponse(this.countClient.repsCurrentlyInStore(isDemo), 0);
  }

  getScheduledTaskCount(
    isDemo: boolean,
    filter: RetailerDashboardFilter,
    dateRange: SelectItem,
  ): Observable<ApiResponse<number>> {
    const dashboardFilter = this.getDashboardFilter(filter, dateRange);
    return handleApiResponse(
      this.countClient.scheduledTasksCount(dashboardFilter, isDemo),
      0,
    );
  }

  getServiceTaskSummaryForRetailer(
    isDemo: boolean,
    filter: RetailerDashboardFilter,
    isShowAll: boolean,
    start: Date,
    end: Date,
  ): Observable<ApiResponse<CalendarTaskEvent[]>> {
    const { sbu, department, departmentGroup } = filter;
    const serviceTaskDashboardFilter: ServiceTaskDashboardFilter = {
      accountId: null,
      dateRange: { startDate: start, endDate: end },
      showAll: isShowAll,
      includeComplete: false,
      includeContinutity: isDemo,
      departmentFilter: {
        sbu: sbu?.id,
        departmentGroup: departmentGroup?.id,
        departmentName: department?.departmentName,
        departmentId: department?.departmentId,
      },
    };
    return handleApiResponse(
      this.serviceTasksClient
        .serviceTaskSummaryForRetailer(serviceTaskDashboardFilter, isDemo)
        .pipe(
          map((tasks) => {
            return tasks.map((t) => {
              const dept = t.departments
                .map((d) => `D${d.number.toString()}-${d.name}`)
                .join(' ');
              return {
                id: t.id,
                title: `${dept}\n${t.taskName}\n(${t.accountName})`,
                start: LuxonUtil.fromDate(t.startDate).toISO(),
                end: t.endDate ? LuxonUtil.fromDate(t.endDate).toISO() : null,
                flag: t.flagged,
                complete: t.completed,
                scheduleImportant: t.scheduleImportant,
              } as CalendarTaskEvent;
            });
          }),
        ),
      [],
    );
  }

  getServiceTaskChartForRetailer(
    isDemo: boolean,
    filter: RetailerDashboardFilter,
    dateRange: SelectItem,
  ): Observable<
    ApiResponse<{
      sortedByTotal: ServiceTaskByPspModel[];
      sortedByTime: ServiceTaskByPspModel[];
    }>
  > {
    const dashboardFilter = this.getDashboardFilter(filter, dateRange);
    return handleApiResponse(
      this.serviceTasksClient
        .serviceTaskChartForRetailerByPsp(dashboardFilter, isDemo)
        .pipe(
          map((serviceTasks) => ({
            sortedByTotal: orderBy(serviceTasks, (task) => task.tasksTotal),
            sortedByTime: orderBy(serviceTasks, (task) => task.estimateTotal),
          })),
          map(({ sortedByTotal, sortedByTime }) => ({
            sortedByTotal: this.getTopNineOrFullList(sortedByTotal),
            sortedByTime: this.getTopNineOrFullList(sortedByTime),
          })),
        ),
      { sortedByTotal: [], sortedByTime: [] },
    );
  }

  getWalmartWeek(start: Date): Observable<WalmartWeek> {
    if (this.loadedWalmartWeeks[start.toISOString()]) {
      return of(this.loadedWalmartWeeks[start.toISOString()]);
    }

    return this.utilitiesClient.getWalmartWeek(start).pipe(
      tap((wmWeek) => {
        this.loadedWalmartWeeks[start.toISOString()] = wmWeek;
      }),
    );
  }

  getSupplierTopList(
    isDemo: boolean,
    filter: RetailerDashboardFilter,
    dateRange: SelectItem,
  ): Observable<ApiResponse<TopSupplierModel[]>> {
    const dashboardFilter = this.getDashboardFilter(filter, dateRange);
    return handleApiResponse(
      this.supplierClient.getSupplierTopList(dashboardFilter, isDemo),
      [],
    );
  }

  getTaskDetail(
    taskId: string,
    scheduleImportant: ScheduleImportant,
  ): Observable<
    ApiResponse<ServiceTaskModel | RetailtainmentServiceTaskViewModel>
  > {
    return handleApiResponse(
      defer(() => {
        if (scheduleImportant === ScheduleImportant.Retailtainment) {
          return this.serviceTasksClient
            .getRetailtainmentTaskInfo(taskId)
            .pipe(
              switchMap((task) =>
                task == null
                  ? this.serviceTasksClient.getServiceTask(taskId)
                  : of(task),
              ),
            );
        }

        return this.serviceTasksClient.getServiceTask(taskId);
      }),
      null,
    );
  }

  private getTopNineOrFullList(tasks: ServiceTaskByPspModel[]) {
    if (tasks.length > 9) {
      const topNine = tasks.slice(0, 9);
      const others = tasks.slice(9);
      const otherTaskModel: ServiceTaskByPspModel = {
        accountId: 99999,
        name: this.translationService.translate('other'),
        estimateTotal: 0,
        tasksTotal: 0,
        breakDown: [],
      };
      for (const otherTask of others) {
        otherTaskModel.estimateTotal += otherTask.estimateTotal;
        otherTaskModel.tasksTotal += otherTask.tasksTotal;
        otherTaskModel.breakDown.push({
          activity: otherTask.name,
          estimate: otherTask.estimateTotal,
          count: otherTask.tasksTotal,
        });
      }
      return topNine.concat(otherTaskModel);
    }

    return tasks;
  }

  private getDashboardFilter(
    filter: RetailerDashboardFilter,
    dateRange: SelectItem,
  ): DashboardFilter {
    return {
      dateRange: LuxonUtil.buildDateRangeAsHours(dateRange.value, 'future'),
      departmentFilter: {
        sbu: filter.sbu?.id,
        departmentGroup: filter.departmentGroup?.id,
        departmentName: filter.department?.departmentName,
        departmentId: filter.department?.departmentId,
      },
      locationNumbers: [],
    };
  }
}
