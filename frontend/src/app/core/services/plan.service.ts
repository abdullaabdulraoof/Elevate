import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Plan {
  _id: string;
  planName: string;
  duration: number;
  durationType: 'days' | 'months' | 'years';
  price: number;
  features: string;
  status: 'active' | 'inactive';
  ispopular: boolean;
  macFreeDays: number;
  maxTrainingSessions: number;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/v1/plans';

  getPlans(): Observable<{ success: boolean; data: Plan[] }> {
    return this.http.get<{ success: boolean; data: Plan[] }>(this.apiUrl);
  }

  getPlan(id: string): Observable<{ success: boolean; data: Plan }> {
    return this.http.get<{ success: boolean; data: Plan }>(`${this.apiUrl}/${id}`);
  }

  createPlan(plan: { planName: string; duration: number; durationType: string; price: number; features?: string; ispopular?: boolean; macFreeDays?: number; maxTrainingSessions?: number }): Observable<{ success: boolean; message: string; data: Plan }> {
    return this.http.post<{ success: boolean; message: string; data: Plan }>(this.apiUrl, plan);
  }

  updatePlan(id: string, plan: Partial<Plan>): Observable<{ success: boolean; message: string; data: Plan }> {
    return this.http.put<{ success: boolean; message: string; data: Plan }>(`${this.apiUrl}/${id}`, plan);
  }

  deletePlan(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }
}
