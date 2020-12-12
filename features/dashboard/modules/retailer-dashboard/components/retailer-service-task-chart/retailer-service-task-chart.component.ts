import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ServiceTaskByPspModel } from '@volt/common/api/dashboard';
import { ApiResponseStatus } from '@volt/common/enums';
import * as Highcharts from 'highcharts';
import DrillDown from 'highcharts/modules/drilldown';
import NoData from 'highcharts/modules/no-data-to-display';
import { RetailerDashboardStateService } from '../../services/retailer-dashboard-state.service';

@Component({
  selector: 'volt-retailer-service-task-chart',
  templateUrl: './retailer-service-task-chart.component.html',
  styleUrls: ['./retailer-service-task-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RetailerServiceTaskChartComponent implements OnInit {
  @Input() dateRangeLabel: string;
  @Input() responseStatus: ApiResponseStatus;
  @Input() responseError: string | unknown;

  @Input() set serviceTasksByPsp(value: ServiceTaskByPspModel[]) {
    this.serviceTasksByPspResponse = value;
    if (this.responseStatus === ApiResponseStatus.Success) {
      this.initChart();
    }
  }

  chartUpdate = false;
  serviceTasksByPspResponse: ServiceTaskByPspModel[];
  Highcharts = Highcharts;
  chartOptions = this.retailerDashboardStateService.getPieChartOptions();

  constructor(
    private readonly retailerDashboardStateService: RetailerDashboardStateService,
  ) {
    DrillDown(this.Highcharts);
    NoData(this.Highcharts);
  }

  ngOnInit(): void {
    Highcharts.setOptions({
      lang: {
        thousandsSep: ',',
      },
    });
  }

  private get chartData(): Highcharts.SeriesPieOptions['data'] {
    return this.serviceTasksByPspResponse.map((d) => ({
      name: d.name,
      y: d.tasksTotal,
      drilldown: d.name,
    }));
  }

  private get drillDownData(): Highcharts.SeriesPieOptions[] {
    return this.serviceTasksByPspResponse.map((d) => ({
      name: d.name,
      id: d.name,
      data: d.breakDown.map((bd) => [bd.activity, bd.count]),
      type: 'pie',
    }));
  }

  private initChart() {
    this.chartOptions.series = [
      {
        name: 'PSP',
        data: this.chartData,
        type: 'pie',
      },
    ];
    this.chartOptions.drilldown = {
      series: this.drillDownData,
    };
    this.chartUpdate = true;
  }
}
