import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../../../core/services/auth';
import { PlanService, Plan } from '../../../core/services/plan.service';

@Component({
  selector: 'app-member-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private authService = inject(Auth);
  private http = inject(HttpClient);
  private planService = inject(PlanService);
  private router = inject(Router);

  user = this.authService.currentUser;
  member = signal<any>(null);
  plan = signal<Plan | null>(null);
  loading = signal(true);

  ngOnInit() {
    if (!this.user()?.email) {
      this.router.navigate(['/login']);
      return;
    }
    this.http.get<{ success: boolean; data: any }>('http://localhost:3000/api/v1/members/me').subscribe({
      next: (res) => {
        this.member.set(res.data);
        if (res.data?.membershipPlan) {
          this.loadPlan(res.data.membershipPlan);
        } else {
          this.loading.set(false);
        }
      },
      error: () => this.loading.set(false),
    });
  }

  private loadPlan(planId: string) {
    this.planService.getPlan(planId).subscribe({
      next: (res) => {
        this.plan.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
