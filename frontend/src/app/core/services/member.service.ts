import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Member {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  address: string;
  height?: number;
  weight?: number;
  goals?: string;
  assignedTrainer?: string;
  membershipPlan?: string;
  membershipStatus?: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/v1/members';

  getMembers(): Observable<{ success: boolean; data: Member[] }> {
    return this.http.get<{ success: boolean; data: Member[] }>(this.apiUrl);
  }

  createMember(member: Member): Observable<{ success: boolean; message: string; data: Member }> {
    return this.http.post<{ success: boolean; message: string; data: Member }>(this.apiUrl, member);
  }

  updateMember(id: string, member: Partial<Member>): Observable<{ success: boolean; message: string; data: Member }> {
    return this.http.put<{ success: boolean; message: string; data: Member }>(`${this.apiUrl}/${id}`, member);
  }

  deleteMember(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }
}
