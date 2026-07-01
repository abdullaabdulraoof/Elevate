import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MemberService, Member } from '../../../core/services/member.service';
import { TrainerService } from '../../../core/services/trainer.service';

interface Plan {
  _id: string;
  planName: string;
  duration: number;
  durationType: string;
  price: number;
}

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './members.html',
})
export class Members implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private memberService = inject(MemberService);
  private trainerService = inject(TrainerService);

  members = signal<Member[]>([]);
  filteredMembers = signal<Member[]>([]);
  trainers = signal<{ _id: string; userId: { username: string } }[]>([]);
  plans = signal<Plan[]>([]);

  showAddModal = false;
  isSubmitting = false;
  formError = signal('');

  editMember: Member | null = null;
  editTrainerId = '';
  editPlanId = '';
  showEditModal = false;
  isEditSubmitting = false;
  editFormError = signal('');

  memberForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s]{10,15}$/)]],
    age: [25, [Validators.required, Validators.min(0)]],
    gender: ['male', [Validators.required]],
    address: ['', [Validators.required, Validators.minLength(10)]],
    height: [null as number | null],
    weight: [null as number | null],
    goals: [''],
    assignedTrainer: [''],
    membershipPlan: [''],
  });

  ngOnInit() {
    this.loadMembers();
    this.trainerService.getTrainers().subscribe({
      next: (res) => this.trainers.set(res.data),
    });
    this.http.get<{ success: boolean; data: Plan[] }>('http://localhost:3000/api/v1/plans').subscribe({
      next: (res) => this.plans.set(res.data),
    });
  }

  loadMembers() {
    this.memberService.getMembers().subscribe({
      next: (res) => {
        if (res.success) {
          this.members.set(res.data);
          this.filteredMembers.set(res.data);
        }
      },
      error: (err) => console.error('Failed to load members', err),
    });
  }

  getTrainerName(member: Member): string {
    const t = member.assignedTrainer as any;
    if (t && typeof t === 'object' && t.userId?.username) {
      return t.userId.username;
    }
    return '—';
  }

  getPlanName(member: Member): string {
    const planId = member.membershipPlan as string;
    if (!planId) return '—';
    const plan = this.plans().find(p => p._id === planId);
    return plan ? plan.planName : '—';
  }

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase().trim();
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

  openAddModal() {
    this.showAddModal = true;
    this.formError.set('');
  }

  closeAddModal() {
    this.showAddModal = false;
    this.memberForm.reset({ age: 25, gender: 'male' });
    this.formError.set('');
  }

  submitMember() {
    if (this.memberForm.invalid) {
      this.memberForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    this.formError.set('');
    const newMember = this.memberForm.value as any;
    newMember.membershipStatus = 'active';

    this.memberService.createMember(newMember).subscribe({
      next: () => {
        this.loadMembers();
        this.closeAddModal();
        this.isSubmitting = false;
      },
      error: (err) => {
        this.formError.set(err.error?.message || 'Failed to create member');
        this.isSubmitting = false;
      },
    });
  }

  openEditModal(member: Member) {
    this.editMember = { ...member };
    this.editTrainerId = member.assignedTrainer && typeof member.assignedTrainer === 'object'
      ? (member.assignedTrainer as any)._id : (member.assignedTrainer as string) || '';
    this.editPlanId = (member.membershipPlan as string) || '';
    this.showEditModal = true;
    this.editFormError.set('');
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editMember = null;
    this.editTrainerId = '';
    this.editPlanId = '';
    this.editFormError.set('');
  }

  saveEdit() {
    if (!this.editMember) return;
    this.isEditSubmitting = true;
    this.editFormError.set('');

    const patch: any = {
      name: this.editMember.name,
      email: this.editMember.email,
      phone: this.editMember.phone,
      age: this.editMember.age,
      gender: this.editMember.gender,
      address: this.editMember.address,
      height: this.editMember.height,
      weight: this.editMember.weight,
      goals: this.editMember.goals,
      assignedTrainer: this.editTrainerId || null,
      membershipPlan: this.editPlanId || null,
      membershipStatus: this.editMember.membershipStatus,
    };

    this.memberService.updateMember(this.editMember._id!, patch).subscribe({
      next: () => {
        this.loadMembers();
        this.closeEditModal();
        this.isEditSubmitting = false;
      },
      error: (err) => {
        this.editFormError.set(err.error?.message || 'Failed to update member');
        this.isEditSubmitting = false;
      },
    });
  }

  deleteMember(member: Member) {
    if (!member._id || !confirm(`Delete member ${member.name}?`)) return;
    this.memberService.deleteMember(member._id).subscribe({
      next: () => this.loadMembers(),
    });
  }

  checkIn(name: string) {
    // check-in is handled by attendance page
  }

  toggleStatus(member: Member) {
    if (!member._id) return;
    const nextStatus = member.membershipStatus === 'active' ? 'inactive' : 'active';
    this.memberService.updateMember(member._id, { membershipStatus: nextStatus }).subscribe({
      next: () => this.loadMembers(),
      error: (err) => console.error(err),
    });
  }
}
