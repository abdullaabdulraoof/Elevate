import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Trainer {
  _id: string;
  userId: {
    _id: string;
    username: string;
    email: string;
  };
  specialization: string;
  experience: number;
  phone: string;
  gender: 'male' | 'female' | 'other';
  assignedMembers: string[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class TrainerService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/v1/trainers';

  getTrainers(): Observable<{ success: boolean; data: Trainer[] }> {
    return this.http.get<{ success: boolean; data: Trainer[] }>(this.apiUrl);
  }

  getTrainer(id: string): Observable<{ success: boolean; data: Trainer }> {
    return this.http.get<{ success: boolean; data: Trainer }>(`${this.apiUrl}/${id}`);
  }

  createTrainer(trainer: { userId: string; specialization: string; experience: number; phone: string; gender: string }): Observable<{ success: boolean; message: string; data: Trainer }> {
    return this.http.post<{ success: boolean; message: string; data: Trainer }>(this.apiUrl, trainer);
  }

  updateTrainer(id: string, trainer: Partial<Trainer>): Observable<{ success: boolean; message: string; data: Trainer }> {
    return this.http.put<{ success: boolean; message: string; data: Trainer }>(`${this.apiUrl}/${id}`, trainer);
  }

  deleteTrainer(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }
}
