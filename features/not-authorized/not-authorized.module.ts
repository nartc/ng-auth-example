import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ContentCardModule } from '@volt/core-ui/components/content-card/content-card.module';
import { VoltTemplateModule } from '@volt/core-ui/directives/volt-template/volt-template.module';
import { ButtonModule } from 'primeng/button';
import { NotAuthorizedComponent } from './not-authorized.component';
import { notAuthorizedRoutes } from './not-authorized.routes';

@NgModule({
  declarations: [NotAuthorizedComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(notAuthorizedRoutes),
    ContentCardModule,
    VoltTemplateModule,
    FontAwesomeModule,
    ButtonModule,
  ],
})
export class NotAuthorizedModule {}
