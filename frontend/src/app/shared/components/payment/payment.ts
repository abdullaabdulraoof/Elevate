import { Component, inject, Input, Output, EventEmitter, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-payment',
  imports: [],
  templateUrl: './payment.html',
  styleUrl: './payment.css',
})
export class Payment {
  private http = inject(HttpClient);

  @Input() amount = 0;
  @Input() memberId = '';
  @Input() planId = '';
  @Input() label = 'Pay Now';
  @Output() paymentSuccess = new EventEmitter<any>();
  @Output() paymentError = new EventEmitter<string>();

  processing = signal(false);

  pay() {
    if (this.processing()) return;
    this.processing.set(true);

    this.http.post<{ success: boolean; data: { order_id: string; amount: number; currency: string } }>(
      'http://localhost:3000/api/v1/payments/create-order',
      { amount: this.amount }
    ).subscribe({
      next: (res) => this.openRazorpay(res.data),
      error: () => {
        this.processing.set(false);
        this.paymentError.emit('Failed to create payment order');
      },
    });
  }

  private openRazorpay(order: { order_id: string; amount: number; currency: string }) {
    const Razorpay = (window as any).Razorpay;
    if (!Razorpay) {
      this.processing.set(false);
      this.paymentError.emit('Razorpay SDK not loaded');
      return;
    }

    const options = {
      key: 'rzp_test_luVXkmBGF0GjXs',
      amount: order.amount,
      currency: order.currency,
      name: 'Elevate',
      description: 'Membership Payment',
      order_id: order.order_id,
      handler: (response: any) => this.onPaymentSuccess(response),
      modal: {
        ondismiss: () => {
          this.processing.set(false);
          this.paymentError.emit('Payment cancelled');
        },
      },
      prefill: {
        contact: '',
        email: '',
      },
      theme: {
        color: '#1a1a2e',
      },
    };

    const rzp = new Razorpay(options);
    rzp.on('payment.failed', (response: any) => {
      this.processing.set(false);
      this.paymentError.emit(response.error?.description || 'Payment failed');
    });
    rzp.open();
  }

  private onPaymentSuccess(response: any) {
    this.http.post<{ success: boolean; message: string; data: any }>(
      'http://localhost:3000/api/v1/payments/verify',
      {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        memberId: this.memberId || undefined,
        planId: this.planId || undefined,
        amount: this.amount,
      }
    ).subscribe({
      next: (res) => {
        this.processing.set(false);
        this.paymentSuccess.emit(res.data);
      },
      error: () => {
        this.processing.set(false);
        this.paymentError.emit('Payment verification failed');
      },
    });
  }
}
