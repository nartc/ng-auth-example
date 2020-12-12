import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import {
  DepartmentGroupModel,
  StrategicBusinessUnitModel,
} from '@volt/common/api/dashboard';
import { BaseFilterForm } from '@volt/common/utilities/form';
import { nameOf } from '@volt/common/utilities/string';
import { distinctUntilKeyChanged } from 'rxjs/operators';
import { RetailerDashboardFilter } from '../../models/retailer-dashboard-filter';
import { RetailerDashboardStateService } from '../../services/retailer-dashboard-state.service';

@Component({
  selector: 'volt-retailer-dashboard-filters',
  templateUrl: './retailer-dashboard-filters.component.html',
  styleUrls: ['./retailer-dashboard-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RetailerDashboardFiltersComponent
  extends BaseFilterForm<RetailerDashboardFilter>
  implements OnInit {
  @Input() filter: RetailerDashboardFilter;

  departmentGroupsCascadeFromKey = nameOf<StrategicBusinessUnitModel>(
    'departmentGroups',
  );
  departmentCascadeFromKey = nameOf<DepartmentGroupModel>('departments');

  dateRangeControl = new FormControl(
    this.retailerDashboardStateService.get().dateRangeFilter,
  );

  constructor(
    private readonly fb: FormBuilder,
    private readonly retailerDashboardStateService: RetailerDashboardStateService,
  ) {
    super();
    retailerDashboardStateService.connect(
      'dateRangeFilter',
      this.dateRangeControl.valueChanges.pipe(distinctUntilKeyChanged('value')),
    );
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      sbu: [null, Validators.required],
      departmentGroup: [null, Validators.required],
      department: [null, Validators.required],
    });
  }

  onSubmit() {
    this.retailerDashboardStateService.updateDepartmentFilter(this.form.value);
  }

  onClear() {
    this.retailerDashboardStateService.clearDepartmentFilter();
    this.form.reset({
      sbu: null,
      departmentGroup: null,
      department: null,
    });
    this.form.markAsUntouched({ onlySelf: false });
  }
}
