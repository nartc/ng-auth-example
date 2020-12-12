import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslatePipeModule } from '@volt/common/translations';
import { ContentCardModule } from '@volt/core-ui/components/content-card/content-card.module';
import { VoltTemplateModule } from '@volt/core-ui/directives/volt-template/volt-template.module';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { LoginComponent } from './components/login/login.component';
import { securityRoutes } from './security.routes';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(securityRoutes),
    TranslatePipeModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    ContentCardModule,
    VoltTemplateModule,
  ],
})
export class SecurityModule {}
