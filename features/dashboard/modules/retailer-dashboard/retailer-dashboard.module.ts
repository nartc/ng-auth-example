import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { LetModule } from '@rx-angular/template';
import { PermissionModule } from '@volt/common/permissions';
import { TranslatePipeModule } from '@volt/common/translations';
import { ContentCardModule } from '@volt/core-ui/components/content-card/content-card.module';
import { ContentWrapperModule } from '@volt/core-ui/components/content-wrapper/content-wrapper.module';
import { DashboardTileModule } from '@volt/core-ui/components/dashboard-tile/dashboard-tile.module';
import { DescriptionModule } from '@volt/core-ui/components/description/description.module';
import { SingleSelectButtonModule } from '@volt/core-ui/components/form-controls/single-select-button/single-select-button.module';
import { SingleSelectModule } from '@volt/core-ui/components/form-controls/single-select/single-select.module';
import { LoadingContainerModule } from '@volt/core-ui/components/loading-container/loading-container.module';
import { PercentCompleteCircleModule } from '@volt/core-ui/components/percent-complete-circle/percent-complete-circle.module';
import { CascadeModule } from '@volt/core-ui/directives/select-items/cascade/cascade.module';
import { DateRangeSelectItemsModule } from '@volt/core-ui/directives/select-items/date-range-select-items/date-range-select-items.module';
import { DepartmentGroupSelectItemsModule } from '@volt/core-ui/directives/select-items/department-group-select-items/department-group-select-items.module';
import { DepartmentSelectItemsModule } from '@volt/core-ui/directives/select-items/department-select-items/department-select-items.module';
import { SbuSelectItemsModule } from '@volt/core-ui/directives/select-items/sbu-select-items/sbu-select-items.module';
import { VoltTemplateModule } from '@volt/core-ui/directives/volt-template/volt-template.module';
import { TimezoneModule } from '@volt/core-ui/pipes/timezone/timezone.module';
import { HighchartsChartModule } from 'highcharts-angular';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { RetailerDashboardFiltersComponent } from './components/retailer-dashboard-filters/retailer-dashboard-filters.component';
import { RetailerDashboardTilesComponent } from './components/retailer-dashboard-tiles/retailer-dashboard-tiles.component';
import { RetailerServiceTaskChartComponent } from './components/retailer-service-task-chart/retailer-service-task-chart.component';
import { RetailerServiceTaskTimeChartComponent } from './components/retailer-service-task-time-chart/retailer-service-task-time-chart.component';
import { RetailerTaskCalendarComponent } from './components/retailer-task-calendar/retailer-task-calendar.component';
import { RetailerTopSupplierChartComponent } from './components/retailer-top-supplier-chart/retailer-top-supplier-chart.component';
import { RetailerCalendarEventModalComponent } from './modals/retailer-calendar-event-modal/retailer-calendar-event-modal.component';
import { ServiceTaskDetailComponent } from './modals/retailer-calendar-event-modal/service-task-detail/service-task-detail.component';
import { retailerDashboardRoutes } from './retailer-dashboard.routes';
import { RetailerDashboardComponent } from './retailer-dashboard/retailer-dashboard.component';

@NgModule({
  declarations: [
    RetailerDashboardComponent,
    RetailerDashboardFiltersComponent,
    RetailerTaskCalendarComponent,
    RetailerDashboardTilesComponent,
    RetailerServiceTaskChartComponent,
    RetailerCalendarEventModalComponent,
    RetailerServiceTaskTimeChartComponent,
    RetailerTopSupplierChartComponent,
    ServiceTaskDetailComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(retailerDashboardRoutes),
    HighchartsChartModule,
    ContentWrapperModule,
    LetModule,
    LoadingContainerModule,
    DropdownModule,
    SingleSelectModule,
    TranslatePipeModule,
    SbuSelectItemsModule,
    DepartmentGroupSelectItemsModule,
    DepartmentSelectItemsModule,
    CascadeModule,
    ButtonModule,
    SingleSelectButtonModule,
    DateRangeSelectItemsModule,
    DashboardTileModule,
    ContentCardModule,
    InputSwitchModule,
    FontAwesomeModule,
    InputTextModule,
    FullCalendarModule,
    DynamicDialogModule,
    VoltTemplateModule,
    DescriptionModule,
    MessagesModule,
    TimezoneModule,
    PermissionModule,
    PercentCompleteCircleModule,
  ],
})
export class RetailerDashboardModule {
  constructor() {
    FullCalendarModule.registerPlugins([dayGridPlugin]);
  }
}
