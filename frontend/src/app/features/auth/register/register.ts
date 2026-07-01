import { Component, signal, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  generatedOtp = signal('');
  otpInput = '';
  otpVerified = signal(false);
  otpError = signal('');

  registerForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    phone: ['', [Validators.required]],
    age: [18, [Validators.required, Validators.min(0)]],
    gender: ['male', [Validators.required]],
    address: ['', [Validators.required]],
  });

  generateOtp() {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    this.generatedOtp.set(otp);
    this.otpInput = '';
    this.otpVerified.set(false);
    this.otpError.set('');
  }

  verifyOtp() {
    if (this.otpInput === this.generatedOtp()) {
      this.otpVerified.set(true);
      this.otpError.set('');
    } else {
      this.otpError.set('Invalid OTP. Please try again.');
    }
  }

  submitRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.errorMessage.set('Please fill in all required fields.');
      return;
    }
    if (!this.otpVerified()) {
      this.otpError.set('Please verify your mobile number first.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const { username, email, password, phone, age, gender, address } = this.registerForm.value;

    this.authService.register(username!, email!, password!, 'member', {
      phone: phone || undefined,
      age: age || undefined,
      gender: gender || undefined,
      address: address || undefined,
    }).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.authService.currentUser.set(res.user);
        this.router.navigate(['/select-plan']);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Registration failed');
        this.isLoading.set(false);
      },
    });
  }
}
