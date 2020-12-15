import { Inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot } from '@angular/router';
import { APP_RETAILER, AppRetailer } from '@volt/common/app-config';
import { getDeepestChildSnapshot } from '@volt/common/utilities/routing';
import { TranslationService } from '../../translations/services/translation.service';

@Injectable({
  providedIn: 'root',
})
export class PageTitleService {
  constructor(
    private readonly title: Title,
    private readonly translationService: TranslationService,
    @Inject(APP_RETAILER) private readonly appRetailer: AppRetailer,
  ) {}

  setPageTitle(pageTitle: string) {
    this.title.setTitle(
      `${pageTitle} | ${this.appRetailer.retailerSystemAppName}`,
    );
  }

  setPageTitleByRouteSnapshot(snapshot: ActivatedRouteSnapshot) {
    const { data } = getDeepestChildSnapshot(snapshot);

    if (!data) {
      return;
    }

    let title = this.translationService.translate('dashboard');
    if (data.titleKey) {
      title = this.translationService.translate(
        data.titleKey,
        data.translateParams,
      );
    } else if (data.title) {
      title = data.title;
    }

    this.setPageTitle(title);
  }
}
