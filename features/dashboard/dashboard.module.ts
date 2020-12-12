import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LetModule } from '@rx-angular/template';
import { LoadingContainerModule } from '@volt/core-ui/components/loading-container/loading-container.module';
import { DashboardLandingComponent } from './dashboard-landing/dashboard-landing.component';
import { dashboardRoutes } from './dashboard.routes';

@NgModule({
  declarations: [DashboardLandingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(dashboardRoutes),
    LetModule,
    LoadingContainerModule,
  ],
})
export class DashboardModule {}
