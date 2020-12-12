import { Component } from '@angular/core';

@Component({
  selector: 'volt-public-layout',
  template: `
    <section class="absolute top-0 right-0 mt-4 mr-4">
      <volt-lang-switch-btn></volt-lang-switch-btn>
    </section>
    <router-outlet></router-outlet>
  `,
})
export class PublicLayoutComponent {}
