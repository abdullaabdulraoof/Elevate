import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PlanService, Plan } from '../../core/services/plan.service';
import { Plans } from '../../shared/components/plans/plans';
import { Payment } from '../../shared/components/payment/payment';

@Component({
  selector: 'app-plan-selection',
  imports: [Plans, Payment],
  templateUrl: './plan-selection.html',
  styleUrl: './plan-selection.css',
})
export class PlanSelection implements OnInit {
  private planService = inject(PlanService);
  private http = inject(HttpClient);
  private router = inject(Router);

  plans = signal<Plan[]>([]);
  loading = signal(false);
  selectedPlan = signal<Plan | null>(null);
  errorMessage = signal('');

  ngOnInit() {
    this.loading.set(true);
    this.planService.getPlans().subscribe({
      next: (res) => { this.plans.set(res.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  selectPlan(planId: string) {
    const plan = this.plans().find(p => p._id === planId);
    if (plan) this.selectedPlan.set(plan);
  }

  onPaymentSuccess() {
    const plan = this.selectedPlan();
    if (!plan) return;
    this.loading.set(true);
    this.errorMessage.set('');

    this.http.patch('http://localhost:3000/api/v1/members/me/plan', { planId: plan._id }).subscribe({
      next: () => {
        this.router.navigate(['/member/dashboard']);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Failed to update plan');
        this.loading.set(false);
      },
    });
  }

  onPaymentError(msg: string) {
    this.errorMessage.set(msg);
    this.selectedPlan.set(null);
  }

  skip() {
    this.router.navigate(['/member/dashboard']);
  }
}
