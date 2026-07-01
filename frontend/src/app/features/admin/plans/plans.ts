import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlanService, Plan } from '../../../core/services/plan.service';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './plans.html',
})
export class Plans implements OnInit {
  private planService = inject(PlanService);

  plans = signal<Plan[]>([]);
  loading = signal(false);

  showAddModal = false;
  addPlanName = '';
  addDuration = 1;
  addDurationType: 'days' | 'months' | 'years' = 'months';
  addPrice = 49;
  addFeatures = '';
  addIspopular = false;
  addMacFreeDays = 0;
  addMaxTrainingSessions = 0;
  addError = signal('');

  editPlan: Plan | null = null;
  showEditModal = false;
  editError = signal('');

  ngOnInit() {
    this.loadPlans();
  }

  loadPlans() {
    this.loading.set(true);
    this.planService.getPlans().subscribe({
      next: (res) => { this.plans.set(res.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  openAddModal() {
    this.showAddModal = true;
    this.addError.set('');
  }

  closeAddModal() {
    this.showAddModal = false;
    this.addPlanName = '';
    this.addDuration = 1;
    this.addDurationType = 'months';
    this.addPrice = 49;
    this.addFeatures = '';
    this.addIspopular = false;
    this.addMacFreeDays = 0;
    this.addMaxTrainingSessions = 0;
    this.addError.set('');
  }

  createPlan() {
    if (!this.addPlanName.trim()) return;
    this.planService.createPlan({
      planName: this.addPlanName,
      duration: this.addDuration,
      durationType: this.addDurationType,
      price: this.addPrice,
      features: this.addFeatures,
      ispopular: this.addIspopular,
      macFreeDays: this.addMacFreeDays,
      maxTrainingSessions: this.addMaxTrainingSessions,
    }).subscribe({
      next: (res) => {
        this.plans.update(list => [res.data, ...list]);
        this.closeAddModal();
      },
      error: (err) => {
        this.addError.set(err.error?.message || 'Failed to create plan');
      },
    });
  }

  openEditModal(plan: Plan) {
    this.editPlan = { ...plan };
    this.showEditModal = true;
    this.editError.set('');
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editPlan = null;
    this.editError.set('');
  }

  saveEdit() {
    if (!this.editPlan) return;
    this.planService.updatePlan(this.editPlan._id, {
      planName: this.editPlan.planName,
      duration: this.editPlan.duration,
      durationType: this.editPlan.durationType,
      price: this.editPlan.price,
      features: this.editPlan.features,
      status: this.editPlan.status,
      ispopular: this.editPlan.ispopular,
      macFreeDays: this.editPlan.macFreeDays,
      maxTrainingSessions: this.editPlan.maxTrainingSessions,
    }).subscribe({
      next: (res) => {
        this.plans.update(list =>
          list.map(p => p._id === this.editPlan!._id ? res.data : p)
        );
        this.closeEditModal();
      },
      error: (err) => {
        this.editError.set(err.error?.message || 'Failed to update plan');
      },
    });
  }

  deletePlan(plan: Plan) {
    if (!confirm(`Delete plan "${plan.planName}"?`)) return;
    this.planService.deletePlan(plan._id).subscribe({
      next: () => {
        this.plans.update(list => list.filter(p => p._id !== plan._id));
      },
    });
  }

  formatDuration(duration: number, type: string): string {
    return `${duration} ${type}`;
  }

  formatFeatures(features: string): string[] {
    if (!features) return [];
    return features.split(',').map(f => f.trim()).filter(f => f.length > 0);
  }
}
