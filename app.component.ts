import { Component, OnInit } from '@angular/core';
import { ResolveEnd, Router } from '@angular/router';
import { AuthService, AuthStateService } from '@volt/common/auth';
import { defaultPieChartColors } from '@volt/common/constants';
import { FeatureFlagService } from '@volt/common/feature-flags';
import { PermissionService } from '@volt/common/permissions';
import { PageTitleService } from '@volt/common/services';
import { TranslationService } from '@volt/common/translations';
import * as Highcharts from 'highcharts';
import { filter } from 'rxjs/operators';



@Component({
  selector: 'volt-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private readonly router: Router,
    private readonly authStateService: AuthStateService,
    private readonly authService: AuthService,
    private readonly translationService: TranslationService,
    private readonly permissionService: PermissionService,
    private readonly featureFlagService: FeatureFlagService,
    private readonly pageTitleService: PageTitleService,
  ) {}

  ngOnInit() {
    this.translationService.setupTranslation();
    this.setupRouteTitleListener();
    this.authService.retrieveTokenOnPageLoad(); // setup authState
    this.authStateService.isAuthorized$.subscribe(() => {
      this.permissionService.loadPermissions();// setup permissionState
      this.featureFlagService.loadFeatures();
    });

    this.setupHighchartsGlobalOptions();
  }

  private setupRouteTitleListener() {
    this.router.events
      .pipe(filter((ev) => ev instanceof ResolveEnd))
      .subscribe((ev: ResolveEnd) => {
        this.pageTitleService.setPageTitleByRouteSnapshot(ev.state.root);
      });
  }

  private setupHighchartsGlobalOptions() {
    Highcharts.setOptions({
      colors: defaultPieChartColors,
      credits: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          showInLegend: true,
          dataLabels: {
            enabled: true,
            distance: -50,
            format: '{point.percentage:.0f}% ({point.y})',
          },
        },
      },
    });
  }
}
