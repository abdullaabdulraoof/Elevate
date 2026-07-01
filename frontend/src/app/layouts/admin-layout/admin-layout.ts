import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { Nav } from '../../shared/models/nav';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {
  authService = inject(Auth);
  private router = inject(Router);

  navItems = [
    { label: 'Dashboard',    route: Nav.Dashboard,    icon: 'dashboard' },
    { label: 'Users',        route: Nav.Users,        icon: 'people' },
    { label: 'Trainers',     route: Nav.Trainers,     icon: 'fitness_center' },
    { label: 'Members',      route: Nav.Members,      icon: 'group' },
    { label: 'Plans',        route: Nav.Plans,        icon: 'schedule' },
    { label: 'Payments',     route: Nav.Payments,     icon: 'payment' },
    { label: 'Attendance',   route: Nav.Attendance,   icon: 'event' },
    { label: 'Reports',      route: Nav.Reports,      icon: 'assessment' },
    { label: 'Activity Logs',route: Nav.ActivityLogs, icon: 'history' },
  ];

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
