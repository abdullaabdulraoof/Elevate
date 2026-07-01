import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MemberService, Member } from '../../../core/services/member.service';
import { MockDataService } from '../../../core/services/mock-data.service';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './attendance.html',
  styleUrl: './attendance.css',
})
export class Attendance implements OnInit {
  private memberService = inject(MemberService);
  mockDataService = inject(MockDataService);

  members = signal<Member[]>([]);
  selectedMemberName = '';
  scanMethod: 'RFID Card' | 'QR Code' | 'Manual Scan' = 'Manual Scan';

  ngOnInit() {
    this.memberService.getMembers().subscribe({
      next: (res) => {
        if (res.success && res.data.length > 0) {
          this.members.set(res.data);
          this.selectedMemberName = res.data[0].name;
        }
      },
      error: (err) => console.error(err)
    });
  }

  simulateCheckIn() {
    if (!this.selectedMemberName) return;
    this.mockDataService.checkInMember(this.selectedMemberName, this.scanMethod);
  }
}
