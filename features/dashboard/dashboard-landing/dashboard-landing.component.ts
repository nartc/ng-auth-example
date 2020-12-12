import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiResponseStatus } from '@volt/common/enums';
import { ApiResponse } from '@volt/common/models';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DashboardLandingService } from '../services/dashboard-landing.service';

@Component({
  selector: 'volt-dashboard-landing',
  templateUrl: './dashboard-landing.component.html',
  styleUrls: ['./dashboard-landing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLandingComponent implements OnInit {
  dashboardResponse$: Observable<ApiResponse<string>>;

  constructor(
    private readonly router: Router,
    private readonly dashboardLandingService: DashboardLandingService,
  ) {}

  ngOnInit(): void {
    this.dashboardResponse$ = this.dashboardLandingService.loadDashboard().pipe(
      tap(({ status, data: dashboardPagePath }) => {
        if (status === ApiResponseStatus.Success) {
          this.router.navigate([dashboardPagePath]);
        }
      }),
    );
  }
}
