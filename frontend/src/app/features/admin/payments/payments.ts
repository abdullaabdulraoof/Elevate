import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService, PaymentRecord } from '../../../core/services/mock-data.service';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payments.html',
  styleUrl: './payments.css',
})
export class Payments {
  mockDataService = inject(MockDataService);

  showAddModal = false;
  memberName = '';
  paymentAmount = 89;
  paymentMethod: PaymentRecord['method'] = 'Credit Card';

  openAddModal() {
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
    this.memberName = '';
    this.paymentAmount = 89;
    this.paymentMethod = 'Credit Card';
  }

  submitPayment() {
    if (!this.memberName.trim()) return;
    this.mockDataService.addPayment({
      memberName: this.memberName,
      amount: this.paymentAmount,
      status: 'Paid',
      method: this.paymentMethod
    });
    this.mockDataService.logActivity('Financial', `Invoice manually posted for ${this.memberName} ($${this.paymentAmount})`);
    this.closeAddModal();
  }
}
