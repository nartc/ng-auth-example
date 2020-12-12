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
  selector: 'volt-retailer-service-task-time-chart',
  templateUrl: './retailer-service-task-time-chart.component.html',
  styleUrls: ['./retailer-service-task-time-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RetailerServiceTaskTimeChartComponent implements OnInit {
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
    return this.serviceTasksByPspResponse
      .map((d) => ({
        name: d.name,
        y: Math.round(d.estimateTotal / 60),
        drilldown: d.name,
      }))
      .filter((d) => d.y > 0);
  }

  private get drillDownData(): Highcharts.SeriesPieOptions[] {
    return this.serviceTasksByPspResponse.map((d) => ({
      name: d.name,
      id: d.name,
      data: d.breakDown.map((bd) => [
        bd.activity,
        Math.round(bd.estimate / 60),
      ]),
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
