import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../../core/services/mock-data.service';

@Component({
  selector: 'app-activity-logs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-logs.html',
  styleUrl: './activity-logs.css',
})
export class ActivityLogs {
  mockDataService = inject(MockDataService);
}
