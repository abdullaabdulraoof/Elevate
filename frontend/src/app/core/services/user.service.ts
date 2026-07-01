import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'trainer' | 'receptionist' | 'member';
  phone?: string;
  profilePicture?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/v1/users';

  createUser(user: { username: string; email: string; password: string; role: string }): Observable<{ success: boolean; message: string; data: User }> {
    return this.http.post<{ success: boolean; message: string; data: User }>(this.apiUrl, user);
  }

  getUsers(): Observable<{ success: boolean; data: User[] }> {
    return this.http.get<{ success: boolean; data: User[] }>(this.apiUrl);
  }

  getUser(id: string): Observable<{ success: boolean; data: User }> {
    return this.http.get<{ success: boolean; data: User }>(`${this.apiUrl}/${id}`);
  }

  updateUser(id: string, user: Partial<User>): Observable<{ success: boolean; message: string; data: User }> {
    return this.http.put<{ success: boolean; message: string; data: User }>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }
}
