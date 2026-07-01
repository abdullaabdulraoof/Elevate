import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MemberService, Member } from '../../../core/services/member.service';

interface ChatMessage {
  text: string;
  sender: 'user' | 'ai';
  time: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private fb = inject(FormBuilder);
  private memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  members = signal<Member[]>([]);
  filteredMembers = signal<Member[]>([]);
  searchQuery = signal('');

  // Stats
  totalMembers = signal(0);
  revenue = signal(0);
  activeTrainers = signal(32);
  capacityPercent = signal(84);

  // Modal & Form
  isAddModalOpen = signal(false);
  isSubmitting = signal(false);
  formError = signal('');
  formSuccess = signal('');

  memberForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s]{10,15}$/)]],
    age: [25, [Validators.required, Validators.min(0)]],
    gender: ['male', [Validators.required]],
    address: ['', [Validators.required, Validators.minLength(10)]]
  });

  // AI Chat
  isChatOpen = signal(false);
  chatInput = signal('');
  chatMessages = signal<ChatMessage[]>([
    {
      text: "Core systems online. I've detected a 5% peak capacity increase trend. Would you like a breakdown?",
      sender: 'ai',
      time: 'Just now'
    }
  ]);

  ngOnInit() {
    this.loadMembers();

    // Listen for addMember query param
    this.route.queryParams.subscribe(params => {
      if (params['addMember'] === 'true') {
        this.openAddModal();
      }
    });
  }

  loadMembers() {
    this.memberService.getMembers().subscribe({
      next: (res) => {
        if (res.success) {
          this.members.set(res.data);
          this.filterMembersList();
          this.calculateStats(res.data);
        }
      },
      error: (err) => {
        console.error('Failed to load members', err);
      }
    });
  }

  calculateStats(memberList: Member[]) {
    this.totalMembers.set(memberList.length);
    // Dynamically calculate revenue
    const calculatedRevenue = memberList.length * 89;
    this.revenue.set(calculatedRevenue);
    
    // capacity: dynamic base + relative factor
    const cap = Math.min(95, 75 + (memberList.length % 20));
    this.capacityPercent.set(cap);
  }

  filterMembersList() {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) {
      this.filteredMembers.set(this.members());
      return;
    }

    const filtered = this.members().filter(m => 
      m.name.toLowerCase().includes(query) || 
      m.email.toLowerCase().includes(query) ||
      m.phone.toLowerCase().includes(query)
    );
    this.filteredMembers.set(filtered);
  }

  onSearch(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
    this.filterMembersList();
  }

  openAddModal() {
    this.isAddModalOpen.set(true);
    this.formError.set('');
    this.formSuccess.set('');
  }

  closeAddModal() {
    this.isAddModalOpen.set(false);
    // Clear query parameters
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { addMember: null },
      queryParamsHandling: 'merge'
    });
  }

  submitMember() {
    if (this.memberForm.invalid) {
      this.memberForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.formError.set('');
    this.formSuccess.set('');

    const newMember = this.memberForm.value as Member;
    newMember.membershipStatus = 'active';

    this.memberService.createMember(newMember).subscribe({
      next: (res) => {
        this.formSuccess.set('Member added successfully!');
        this.memberForm.reset({ age: 25, gender: 'male' });
        this.loadMembers();
        setTimeout(() => {
          this.closeAddModal();
          this.isSubmitting.set(false);
        }, 1500);
      },
      error: (err) => {
        const errMsg = err.error?.errors?.[0]?.msg || err.error?.message || 'Failed to create member.';
        this.formError.set(errMsg);
        this.isSubmitting.set(false);
      }
    });
  }

  toggleChat() {
    this.isChatOpen.set(!this.isChatOpen());
  }

  sendChatMessage() {
    const query = this.chatInput().trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      text: query,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    this.chatMessages.update(msgs => [...msgs, userMsg]);
    this.chatInput.set('');

    setTimeout(() => {
      let replyText = '';
      const lowercaseQuery = query.toLowerCase();

      if (lowercaseQuery.includes('capacity')) {
        const count = Math.round(250 * (this.capacityPercent() / 100));
        replyText = `Current capacity is at ${this.capacityPercent()}%. That is approximately ${count} members checked in out of a maximum of 250. Peak hours are expected to conclude in 45 minutes.`;
      } else if (lowercaseQuery.includes('search') || lowercaseQuery.includes('find') || lowercaseQuery.includes('member')) {
        const words = lowercaseQuery.split(' ');
        let searchName = '';
        for (const w of words) {
          if (w !== 'search' && w !== 'find' && w !== 'member' && w.length > 2) {
            searchName = w;
            break;
          }
        }
        
        if (searchName) {
          const matches = this.members().filter(m => m.name.toLowerCase().includes(searchName));
          if (matches.length > 0) {
            replyText = `I found ${matches.length} matching member(s):\n` + 
              matches.map(m => `• ${m.name} (${m.email}) - Status: ${m.membershipStatus?.toUpperCase()}`).join('\n');
          } else {
            replyText = `No members found matching "${searchName}" in the database.`;
          }
        } else {
          replyText = `To search members, please type "search [name]". Currently there are ${this.members().length} members in the database.`;
        }
      } else if (lowercaseQuery.includes('revenue') || lowercaseQuery.includes('money') || lowercaseQuery.includes('sales')) {
        replyText = `Total projected revenue for this month is $${this.revenue().toLocaleString()}, based on ${this.totalMembers()} registered members with an average contract value of $89/mo.`;
      } else if (lowercaseQuery.includes('trainer') || lowercaseQuery.includes('staff')) {
        replyText = `We currently have ${this.activeTrainers()} active trainers scheduled for today. Rotation is at 100% efficiency with no pending shift coverage requests.`;
      } else {
        replyText = `System analysis: All core database links are active. I can assist you with "capacity details", searching member profiles (e.g. "search sarah"), or displaying monthly "revenue statistics".`;
      }

      const aiMsg: ChatMessage = {
        text: replyText,
        sender: 'ai',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      this.chatMessages.update(msgs => [...msgs, aiMsg]);
    }, 1000);
  }
}
