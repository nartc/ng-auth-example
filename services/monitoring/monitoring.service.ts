import { Inject, Injectable } from '@angular/core';
import {
  ApplicationInsights,
  IExceptionTelemetry,
  SeverityLevel,
} from '@microsoft/applicationinsights-web';
import { ApiError, SwaggerException } from '@volt/common/api/dashboard';
import { APP_INSIGHTS } from './application-insights.provider';

@Injectable({
  providedIn: 'root',
})
export class MonitoringService {
  constructor(
    @Inject(APP_INSIGHTS) private readonly appInsights: ApplicationInsights,
  ) {
    if (appInsights == null) {
      console.log('Application insights not configured for this environment');
    } else {
      appInsights.loadAppInsights();
      appInsights.trackPageView();
    }
  }

  logApiException(error: unknown): void {
    const exception = new Error();

    if (SwaggerException.isSwaggerException(error)) {
      exception.message = error.message;
      exception.stack = error.stack;
    } else {
      exception.message = (error as ApiError).error || 'Unknown error';
      exception.stack = (error as ApiError).detail || 'No stack trace';
    }

    this.appInsights?.trackException({
      exception,
      severityLevel: SeverityLevel.Error,
    });
  }

  logError(
    exception: Error,
    properties?: IExceptionTelemetry['properties'],
  ): void {
    this.appInsights?.trackException({
      exception,
      properties,
    });
  }

  setAuthenticatedUserId(userId: string, accountId: string): void {
    this.appInsights?.setAuthenticatedUserContext(userId, accountId, true);
  }
}
