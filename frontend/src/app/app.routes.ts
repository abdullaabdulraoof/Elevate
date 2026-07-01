import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { PlanSelection } from './features/plan-selection/plan-selection';
import { Dashboard as MemberDashboard } from './features/member/dashboard/dashboard';
import { Dashboard as TrainerDashboard } from './features/trainer/dashboard/dashboard';
import {AdminLayout} from './layouts/admin-layout/admin-layout';
import { Dashboard as AdminDashboard } from './features/admin/dashboard/dashboard';
import { Users } from './features/admin/users/users';
import { Trainers } from './features/admin/trainers/trainers';
import { Members } from './features/admin/members/members';
import { Plans } from './features/admin/plans/plans';
import { Payments } from './features/admin/payments/payments';
import { Attendance } from './features/admin/attendance/attendance';
import { Reports } from './features/admin/reports/reports';
import { ActivityLogs } from './features/admin/activity-logs/activity-logs';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: '', component: Home },

  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'select-plan', component: PlanSelection, canActivate: [authGuard] },
  { path: 'member/dashboard', component: MemberDashboard, canActivate: [authGuard] },
  { path: 'trainer/dashboard', component: TrainerDashboard, canActivate: [authGuard] },

  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: AdminDashboard },
      { path: 'users', component: Users },
      { path: 'trainers', component: Trainers },
      { path: 'members', component: Members },
      { path: 'plans', component: Plans },
      { path: 'payments', component: Payments },
      { path: 'attendance', component: Attendance },
      { path: 'reports', component: Reports },
      { path: 'activity-logs', component: ActivityLogs },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
