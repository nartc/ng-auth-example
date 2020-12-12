import { Routes } from '@angular/router';
import { AuthenticatedGuard, PermissionGuard } from '@volt/common/guards';
import { PermissionNames, Privilege } from '@volt/common/permissions';
import { AuthLayoutComponent, PublicLayoutComponent } from '@volt/layouts';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    canActivate: [AuthenticatedGuard],
    component: AuthLayoutComponent,
    children: [
      {
        path: 'dashboard',
        canLoad: [PermissionGuard],
        data: {
          permission: [PermissionNames.DashboardManage, Privilege.Read],
        },
        loadChildren: () =>
          import('@volt/features/dashboard').then((m) => m.DashboardModule),
      },
    ],
  },
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@volt/features/security').then((m) => m.SecurityModule),
      },
      {
        path: 'not-authorized',
        loadChildren: () =>
          import('@volt/features/not-authorized').then(
            (m) => m.NotAuthorizedModule,
          ),
      },
    ],
  },
];
