import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ServiceTaskModel } from '@volt/common/api/dashboard';

@Component({
  selector: 'volt-service-task-detail',
  templateUrl: './service-task-detail.component.html',
  styleUrls: ['./service-task-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceTaskDetailComponent implements OnInit {
  @Input() serviceTask: ServiceTaskModel;
  @Input() isCashRecyclingHigh = false;
  @Input() showPercentComplete = false;

  @Output() goToServiceTask = new EventEmitter<string>();

  percentComplete = 0;

  constructor() {}

  ngOnInit(): void {
    if (this.showPercentComplete && this.serviceTask?.locationNumbers?.length) {
      this.percentComplete = Math.round(
        (this.serviceTask.tasksCompleteCount /
          this.serviceTask.locationNumbers.length) *
          100,
      );
    }
  }
}
