import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../../core/services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './users.html',
})
export class Users implements OnInit {
  private userService = inject(UserService);

  users = signal<User[]>([]);
  loading = signal(false);

  showAddModal = false;
  newUsername = '';
  newUserEmail = '';
  newPassword = '';
  newUserRole: User['role'] = 'member';
  addError = signal('');

  editUser: User | null = null;
  editUsername = '';
  editEmail = '';
  editRole: User['role'] = 'member';

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading.set(true);
    this.userService.getUsers().subscribe({
      next: (res) => {
        this.users.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openAddModal() {
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
    this.newUsername = '';
    this.newUserEmail = '';
    this.newPassword = '';
    this.newUserRole = 'member';
    this.addError.set('');
  }

  openEditModal(user: User) {
    this.editUser = user;
    this.editUsername = user.username;
    this.editEmail = user.email;
    this.editRole = user.role;
  }

  closeEditModal() {
    this.editUser = null;
    this.editUsername = '';
    this.editEmail = '';
    this.editRole = 'member';
  }

  createUser() {
    if (!this.newUsername.trim() || !this.newUserEmail.trim() || !this.newPassword.trim()) return;
    this.userService.createUser({
      username: this.newUsername,
      email: this.newUserEmail,
      password: this.newPassword,
      role: this.newUserRole,
    }).subscribe({
      next: (res) => {
        this.users.update(list => [{ ...res.data, _id: res.data._id }, ...list]);
        this.closeAddModal();
      },
      error: (err) => {
        this.addError.set(err.error?.message || 'Failed to create user');
      },
    });
  }

  saveEdit() {
    if (!this.editUser) return;
    this.userService.updateUser(this.editUser._id, {
      username: this.editUsername,
      email: this.editEmail,
      role: this.editRole,
    }).subscribe({
      next: (res) => {
        this.users.update(list =>
          list.map(u => u._id === this.editUser!._id ? { ...u, ...res.data } : u)
        );
        this.closeEditModal();
      },
    });
  }

  deleteUser(user: User) {
    if (!confirm(`Delete user ${user.username}?`)) return;
    this.userService.deleteUser(user._id).subscribe({
      next: () => {
        this.users.update(list => list.filter(u => u._id !== user._id));
      },
    });
  }

  formatDate(date?: string) {
    if (!date) return '—';
    return new Date(date).toLocaleDateString();
  }
}
