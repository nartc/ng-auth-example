import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import {
  RetailtainmentServiceTaskViewModel,
  ScheduleImportant,
  ServiceTaskModel,
  TaskResultModel,
} from '@volt/common/api/dashboard';
import { ApiResponseStatus } from '@volt/common/enums';
import { TranslationService } from '@volt/common/translations';
import { combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { RetailerDashboardService } from './retailer-dashboard.service';

export interface RetailerCalendarEventVm {
  status: ApiResponseStatus;
  error: string | unknown;
  title: string;
  scheduleImportant: ScheduleImportant;
  serviceTask: ServiceTaskModel;
  retailtainmentTask: RetailtainmentServiceTaskViewModel;
  serviceTaskResult: TaskResultModel;
}

export interface RetailerCalendarEventModalState {
  taskId: string;
  scheduleImportant: ScheduleImportant;
  vm: RetailerCalendarEventVm;
}

@Injectable()
export class RetailerCalendarEventModalStateService extends RxState<
  RetailerCalendarEventModalState
> {
  vm$ = this.select('vm');

  constructor(
    private readonly translationService: TranslationService,
    private readonly retailerDashboardService: RetailerDashboardService,
  ) {
    super();
    this.reset();
    this.connect('vm', this.vmEffect$);
  }

  updateTaskDetailFilter(taskId: string, scheduleImportant: ScheduleImportant) {
    this.set({ taskId, scheduleImportant });
  }

  reset() {
    this.set({
      taskId: '',
      scheduleImportant: null,
    });
  }

  private get vmEffect$() {
    return combineLatest([
      this.select('taskId'),
      this.select('scheduleImportant'),
    ]).pipe(
      switchMap(([taskId, scheduleImportant]) =>
        this.retailerDashboardService
          .getTaskDetail(taskId, scheduleImportant)
          .pipe(
            map(({ data, status, error }) => {
              let title = '';
              let retailtainmentTask = null;
              let serviceTask = null;
              let serviceTaskResult = null;

              if (status === ApiResponseStatus.Loading) {
                title = this.translationService.translate('loading') + '...';
              } else if (status === ApiResponseStatus.Failure) {
                title = this.translationService.translate('errorLoading');
              } else {
                if (this.retailtainmentTaskTypeGuard(data)) {
                  title = `${data.strategicBusinessUnit} - ${data.activity}`;
                  retailtainmentTask = data;
                } else {
                  title = `D${data.departments?.[0]?.number} ${data.departments?.[0]?.name} - ${data.activity}`;
                  serviceTaskResult = data.completed ? data.taskResult : null;
                  serviceTask = data;
                }
              }

              return {
                title,
                scheduleImportant,
                serviceTaskResult,
                serviceTask,
                retailtainmentTask,
                error,
                status,
              };
            }),
          ),
      ),
    );
  }

  private retailtainmentTaskTypeGuard(
    task: ServiceTaskModel | RetailtainmentServiceTaskViewModel,
  ): task is RetailtainmentServiceTaskViewModel {
    return 'strategicBusinessUnit' in task;
  }
}
