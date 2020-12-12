import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ApiResponse } from '@volt/common/models';
import { RetailerDashboardStateService } from '../../services/retailer-dashboard-state.service';

@Component({
  selector: 'volt-retailer-dashboard-tiles',
  templateUrl: './retailer-dashboard-tiles.component.html',
  styleUrls: ['./retailer-dashboard-tiles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RetailerDashboardTilesComponent {
  @Input() dateRangeLabel: string;
  @Input() repsInStore: ApiResponse<number>;
  @Input() scheduledTasks: ApiResponse<number>;

  constructor(
    private readonly retailerDashboardStateService: RetailerDashboardStateService,
  ) {}

  onNow() {
    this.retailerDashboardStateService.notifyRepsInStore();
  }
}
