import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TrainerService, Trainer } from '../../../core/services/trainer.service';
import { UserService, User } from '../../../core/services/user.service';

@Component({
  selector: 'app-trainers',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './trainers.html',
})
export class Trainers implements OnInit {
  private trainerService = inject(TrainerService);
  private userService = inject(UserService);

  trainers = signal<Trainer[]>([]);
  users = signal<User[]>([]);
  loading = signal(false);
  loadError = signal('');

  showAddModal = false;
  addUserId = '';
  addSpecialization = '';
  addExperience = 0;
  addPhone = '';
  addGender: 'male' | 'female' | 'other' = 'male';
  addError = signal('');

  editTrainer: Trainer | null = null;
  editSpecialization = '';
  editExperience = 0;
  editPhone = '';
  editGender: 'male' | 'female' | 'other' = 'male';
  editStatus: 'active' | 'inactive' = 'active';

  ngOnInit() {
    this.loadTrainers();
    this.userService.getUsers().subscribe({
      next: (res) => this.users.set(res.data),
    });
  }

  loadTrainers() {
    this.loading.set(true);
    this.loadError.set('');
    this.trainerService.getTrainers().subscribe({
      next: (res) => { this.trainers.set(res.data); this.loading.set(false); },
      error: (err) => {
        this.loadError.set(err.error?.message || err.message || 'Failed to load trainers');
        this.loading.set(false);
      },
    });
  }

  openAddModal() {
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
    this.addUserId = '';
    this.addSpecialization = '';
    this.addExperience = 0;
    this.addPhone = '';
    this.addGender = 'male';
    this.addError.set('');
  }

  createTrainer() {
    if (!this.addUserId || !this.addSpecialization.trim() || !this.addPhone.trim()) return;
    this.trainerService.createTrainer({
      userId: this.addUserId,
      specialization: this.addSpecialization,
      experience: this.addExperience,
      phone: this.addPhone,
      gender: this.addGender,
    }).subscribe({
      next: (res) => {
        this.trainers.update(list => [res.data, ...list]);
        this.closeAddModal();
      },
      error: (err) => {
        this.addError.set(err.error?.message || 'Failed to create trainer');
      },
    });
  }

  openEditModal(trainer: Trainer) {
    this.editTrainer = trainer;
    this.editSpecialization = trainer.specialization;
    this.editExperience = trainer.experience;
    this.editPhone = trainer.phone;
    this.editGender = trainer.gender;
    this.editStatus = trainer.status;
  }

  closeEditModal() {
    this.editTrainer = null;
  }

  saveEdit() {
    if (!this.editTrainer) return;
    this.trainerService.updateTrainer(this.editTrainer._id, {
      specialization: this.editSpecialization,
      experience: this.editExperience,
      phone: this.editPhone,
      gender: this.editGender,
      status: this.editStatus,
    }).subscribe({
      next: (res) => {
        this.trainers.update(list =>
          list.map(t => t._id === this.editTrainer!._id ? res.data : t)
        );
        this.closeEditModal();
      },
    });
  }

  deleteTrainer(trainer: Trainer) {
    if (!confirm(`Delete trainer ${trainer.userId.username}?`)) return;
    this.trainerService.deleteTrainer(trainer._id).subscribe({
      next: () => {
        this.trainers.update(list => list.filter(t => t._id !== trainer._id));
      },
    });
  }
}
