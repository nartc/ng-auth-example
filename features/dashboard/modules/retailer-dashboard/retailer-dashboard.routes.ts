import { Routes } from '@angular/router';
import { translationKey } from '@volt/common/utilities/string';
import { RetailerDashboardComponent } from './retailer-dashboard/retailer-dashboard.component';

export const retailerDashboardRoutes: Routes = [
  {
    path: '',
    component: RetailerDashboardComponent,
    data: { titleKey: translationKey('dashboard') },
  },
];
