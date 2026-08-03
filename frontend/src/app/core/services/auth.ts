import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  token: string;
  memberId: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/v1/auth';

  currentUser = signal<User | null>(this.getUserFromStorage());

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<{ data: LoginResponse }>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        map((res) => res.data),
        tap((res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          this.currentUser.set(res.user);
        })
      );
  }

  register(username: string, email: string, password: string, role = 'member', extra?: { phone?: string; age?: number; gender?: string; address?: string; membershipPlan?: string }): Observable<RegisterResponse> {
    return this.http
      .post<{ data: RegisterResponse }>(`${this.apiUrl}/register`, {
        username,
        email,
        password,
        role,
        ...extra,
      })
      .pipe(map((res) => res.data));
  }

  getProfile(): Observable<any> {
    return this.http.get<{ data: any }>(`${this.apiUrl}/profile`).pipe(map((res) => res.data));
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        return JSON.parse(userJson) as User;
      } catch {
        return null;
      }
    }
    return null;
  }
}
