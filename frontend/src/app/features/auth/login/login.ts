import { Component, signal, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal('');

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  submitLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set('');

    const { email, password } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        const role = res.user.role;
        if (role === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else if (role === 'trainer') {
          this.router.navigate(['/trainer/dashboard']);
        } else {
          this.router.navigate(['/member/dashboard']);
        }
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Invalid email or password. Please try again.');
        this.isLoading.set(false);
      }
    });
  }
}
