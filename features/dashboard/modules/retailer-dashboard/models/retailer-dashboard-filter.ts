import {
  DepartmentGroupModel,
  DepartmentModel,
  StrategicBusinessUnitModel,
} from '@volt/common/api/dashboard';

export interface RetailerDashboardFilter {
  sbu: StrategicBusinessUnitModel;
  departmentGroup: DepartmentGroupModel;
  department: DepartmentModel;
}
