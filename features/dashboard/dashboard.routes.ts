import { Routes } from '@angular/router';
import { DashboardLandingComponent } from './dashboard-landing/dashboard-landing.component';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardLandingComponent,
    children: [
      {
        path: 'retailer-dashboard',
        loadChildren: () =>
          import('./modules/retailer-dashboard/retailer-dashboard.module').then(
            (m) => m.RetailerDashboardModule,
          ),
      },
    ],
  },
];
