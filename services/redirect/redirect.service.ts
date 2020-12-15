import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { getDeepestChildSnapshot } from '@volt/common/utilities/routing';

@Injectable({
  providedIn: 'root',
})
export class RedirectService {
  constructor(private readonly router: Router) {}

  redirectToLogin(): void {
    const deepestSnapshot = getDeepestChildSnapshot(
      this.router.routerState.snapshot.root,
    );

    if (deepestSnapshot.url.some((seg) => seg.path.includes('login'))) {
      return;
    }

    const returnUrl =
      deepestSnapshot.url.map((url) => url.path).join('/') ||
      this.router.routerState.snapshot.url;

    this.router.navigate(['/login'], {
      queryParams: { returnUrl },
    });
  }

  redirectToNotAuthorized(): void {
    this.router.navigate(['/not-authorized']);
  }
}
