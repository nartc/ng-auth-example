import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'volt-not-authorized',
  templateUrl: './not-authorized.component.html',
  styleUrls: ['./not-authorized.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotAuthorizedComponent {
  constructor(
    private readonly router: Router,
    private readonly location: Location,
  ) {}

  goHome() {
    this.router.navigate(['/dashboard']);
  }

  goBack() {
    this.location.back();
  }
}
