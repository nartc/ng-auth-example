import { InjectionToken, Provider } from '@angular/core';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { APP_CONFIG, AppConfig } from '@volt/common/app-config';

export const APP_INSIGHTS = new InjectionToken<ApplicationInsights>(
  '@@voltApplicationInsights',
);

export const applicationInsightsProvider: Provider = {
  provide: APP_INSIGHTS,
  useFactory: (appConfig: AppConfig) => {
    if (appConfig.appInsights?.instrumentationKey) {
      return new ApplicationInsights({
        config: {
          instrumentationKey: appConfig.appInsights.instrumentationKey,
        },
      });
    }
    return null;
  },
  deps: [APP_CONFIG],
};
