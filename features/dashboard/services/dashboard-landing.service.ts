import { Injectable } from '@angular/core';
import { RoleClient } from '@volt/common/api/dashboard';
import { AuthStateService } from '@volt/common/auth';
import { ApiResponse } from '@volt/common/models';
import { handleApiResponse } from '@volt/common/utilities/rx';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DashboardLandingService {
  constructor(
    private readonly roleClient: RoleClient,
    private readonly authStateService: AuthStateService,
  ) {}

  loadDashboard(): Observable<ApiResponse<string>> {
    return this.authStateService.currentUser$.pipe(
      take(1),
      switchMap((currentUser) =>
        handleApiResponse(
          this.roleClient.getLandingPage(currentUser.roles),
          null,
        ),
      ),
    );
  }
}
