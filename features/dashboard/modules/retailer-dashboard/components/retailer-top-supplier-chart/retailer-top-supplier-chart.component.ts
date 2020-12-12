import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { TopSupplierModel } from '@volt/common/api/dashboard';
import { ApiResponseStatus } from '@volt/common/enums';
import { ApiResponse } from '@volt/common/models';
import * as Highcharts from 'highcharts';
import { RetailerDashboardStateService } from '../../services/retailer-dashboard-state.service';

@Component({
  selector: 'volt-retailer-top-supplier-chart',
  templateUrl: './retailer-top-supplier-chart.component.html',
  styleUrls: ['./retailer-top-supplier-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RetailerTopSupplierChartComponent implements OnInit {
  @Input() dateRangeLabel: string;

  @Input() set topSupplier(value: ApiResponse<TopSupplierModel[]>) {
    this.topSupplierResponse = value;
    if (value.status === ApiResponseStatus.Success) {
      this.initChart();
    }
  }

  topSupplierResponse: ApiResponse<TopSupplierModel[]>;
  chartUpdate = false;
  Highcharts = Highcharts;
  chartOptions = this.retailerDashboardStateService.getBarChartOptions();

  constructor(
    private readonly retailerDashboardStateService: RetailerDashboardStateService,
  ) {}

  ngOnInit(): void {}

  private get chartData(): Highcharts.SeriesColumnOptions['data'] {
    this.topSupplierResponse.data.sort((a, b) => {
      if (a.count === b.count) {
        return 0;
      }
      return a.count > b.count ? -1 : 1;
    });

    return this.topSupplierResponse.data.map((d) => ({
      name: d.supplierName,
      y: d.count,
    }));
  }

  private initChart() {
    this.chartOptions.series = [
      {
        name: 'Suppliers',
        data: this.chartData,
        type: 'column',
      },
    ];
    this.chartUpdate = true;
  }
}
