import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import {
  TRANSLOCO_CONFIG,
  TRANSLOCO_LOADING_TEMPLATE,
  TranslocoModule,
} from '@ngneat/transloco';
import { TranslocoPreloadLangsModule } from '@ngneat/transloco-preload-langs';
import { authInterceptorProvider } from '@volt/common/auth';
import { monitoringErrorHandlerProvider } from '@volt/common/error-handlers';
import { FaIconsModule } from '@volt/common/fa-icons';
import { browserLanguageInterceptorProvider } from '@volt/common/interceptors';
import { applicationInsightsProvider } from '@volt/common/services';
import { translocoHttpLoaderProvider } from '@volt/common/translations';
import { LangSwitchBtnModule } from '@volt/core-ui/components/lang-switch-btn/lang-switch-btn.module';
import { SideNavModule } from '@volt/core-ui/components/side-nav/side-nav.module';
import { TopNavModule } from '@volt/core-ui/components/top-nav/top-nav.module';
import { environment } from '@volt/environments';
import { AuthLayoutComponent, PublicLayoutComponent } from '@volt/layouts';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';

@NgModule({
  declarations: [AppComponent, PublicLayoutComponent, AuthLayoutComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    TranslocoModule,
    TranslocoPreloadLangsModule.preload(['en', 'es']),
    FaIconsModule,
    TopNavModule,
    LangSwitchBtnModule,
    SideNavModule,
  ],
  providers: [
    {
      provide: TRANSLOCO_CONFIG,
      useValue: {
        availableLangs: ['en', 'es'],
        defaultLang: 'en',
        fallbackLang: 'en',
        prodMode: environment.production,
      },
    },
    {
      provide: TRANSLOCO_LOADING_TEMPLATE,
      useValue: '<p>loading...</p>',
    },
    translocoHttpLoaderProvider,
    applicationInsightsProvider,
    authInterceptorProvider,
    browserLanguageInterceptorProvider,
    monitoringErrorHandlerProvider,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
