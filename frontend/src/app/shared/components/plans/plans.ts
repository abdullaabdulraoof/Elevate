import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Plan } from '../../../core/services/plan.service';

@Component({
  selector: 'app-plans',
  imports: [],
  templateUrl: './plans.html',
  styleUrl: './plans.css',
})
export class Plans {
  @Input() plans: Plan[] = [];
  @Input() loading = false;
  @Input() selectedPlanId = '';
  @Output() selectPlan = new EventEmitter<string>();
  @Output() skip = new EventEmitter<void>();
}
