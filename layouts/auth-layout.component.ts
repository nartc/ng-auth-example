import {
  animate,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslationService } from '@volt/common/translations';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'volt-auth-layout',
  template: `
    <volt-top-nav></volt-top-nav>
    <div class="side-nav hidden lg:block">
      <volt-side-nav></volt-side-nav>
    </div>
    <div class="content">
      <div [@routeFade]="getOutletState(o)" class="w-full h-full">
        <router-outlet #o="outlet"></router-outlet>
      </div>
    </div>
  `,
  styleUrls: ['./auth-layout.component.scss'],
  animations: [
    trigger('routeFade', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({
              opacity: 0,
              position: 'absolute',
              top: '8px',
              left: 0,
              right: 0,
              bottom: 0,
            }),
          ],
          { optional: true },
        ),
        query(
          ':leave',
          [
            style({
              opacity: 1,
              position: 'absolute',
              top: '8px',
              left: 0,
              right: 0,
              bottom: 0,
            }),
            animate('0.2s', style({ opacity: 0 })),
          ],
          { optional: true },
        ),
        query(
          ':enter',
          [
            style({
              opacity: 0,
              top: '8px',
              left: 0,
              right: 0,
              bottom: 0,
            }),
            animate('0.2s', style({ opacity: 1 })),
          ],
          { optional: true },
        ),
      ]),
    ]),
  ],
})
export class AuthLayoutComponent {
  constructor(translationService: TranslationService) {
    Highcharts.setOptions({
      lang: {
        noData: translationService.translate('noDataToDisplay'),
      },
    });
  }

  getOutletState(o: RouterOutlet) {
    return o.isActivated ? o.activatedRoute : '';
  }
}
