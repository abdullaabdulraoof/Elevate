import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-trainer-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private authService = inject(Auth);
  private router = inject(Router);

  user = this.authService.currentUser;

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
