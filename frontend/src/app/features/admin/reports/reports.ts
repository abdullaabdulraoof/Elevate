import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberService, Member } from '../../../core/services/member.service';
import { MockDataService } from '../../../core/services/mock-data.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class Reports implements OnInit {
  private memberService = inject(MemberService);
  mockDataService = inject(MockDataService);

  totalMembers = signal(0);
  revenue = signal(0);
  peakLoad = signal(84);

  ngOnInit() {
    this.memberService.getMembers().subscribe({
      next: (res) => {
        if (res.success) {
          const count = res.data.length;
          this.totalMembers.set(count);
          this.revenue.set(count * 89);
          this.peakLoad.set(Math.min(95, 70 + (count % 20)));
        }
      },
      error: (err) => console.error(err)
    });
  }
}
