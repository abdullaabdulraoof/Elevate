import { Injectable, signal } from '@angular/core';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Trainer' | 'Staff';
  status: 'active' | 'inactive';
  lastActive: string;
}

export interface Trainer {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  activeClients: number;
  weeklyHours: number;
  status: 'Active' | 'On Leave';
  imageUrl: string;
}

export interface GymPlan {
  id: string;
  name: string;
  price: number;
  billingPeriod: string;
  features: string[];
  activeMembers: number;
  status: 'active' | 'archived';
}

export interface PaymentRecord {
  id: string;
  memberName: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending' | 'Failed';
  method: 'Credit Card' | 'PayPal' | 'Bank Transfer';
}

export interface AttendanceRecord {
  id: string;
  memberName: string;
  checkInTime: string;
  method: 'RFID Card' | 'QR Code' | 'Manual Scan';
  status: 'Success' | 'Denied';
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  category: 'Security' | 'Membership' | 'Financial' | 'Trainer';
  message: string;
  adminName: string;
}

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  // 1. Users Signals
  users = signal<User[]>([
    { id: 'usr-1', name: 'Elevate Admin', email: 'admin@elevate.com', role: 'Admin', status: 'active', lastActive: 'Just now' },
    { id: 'usr-2', name: 'Sarah Connor', email: 'sarah.c@elevate.com', role: 'Trainer', status: 'active', lastActive: '5 mins ago' },
    { id: 'usr-3', name: 'Mike Tyson', email: 'mike.t@elevate.com', role: 'Trainer', status: 'active', lastActive: '1 hour ago' },
    { id: 'usr-4', name: 'John Doe', email: 'john.doe@elevate.com', role: 'Staff', status: 'inactive', lastActive: '2 days ago' }
  ]);

  // 2. Trainers Signals
  trainers = signal<Trainer[]>([
    {
      id: 'trn-1',
      name: 'Sarah Connor',
      specialty: 'Strength & Conditioning',
      rating: 4.9,
      activeClients: 18,
      weeklyHours: 36,
      status: 'Active',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGsHwzEO6N8wTTdUE14V84CObQD_g0jhvORwW6mfZ2E-p6NWgQ4lCPTW2OU4abpSxbKxbVKuhIfyga1Llo410BUqo0p2hK_ju46akoqHZ5z85Swv0g0pKU5F66-4jDXYvt0YS7q0r2q8Wx-_gzuOV58xcfXT18OUpg0yOu5GJ6T_aaHgh4Z1gNfdk2ccKH0EfnFPkg1i-q8JKh86hPVq26BKxy_zkseBiUs3Zv4nQao2IJPDNTgShZ-53FcY3yjKU681irVNheJ24q'
    },
    {
      id: 'trn-2',
      name: 'Mike Tyson',
      specialty: 'Boxing & Explosive Power',
      rating: 5.0,
      activeClients: 24,
      weeklyHours: 40,
      status: 'Active',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRahHPTt7oXFUtG_wlej0zEG6fJT4Lmf1w4jeJ7YDvO9DvOigjQBvB5tfJ62xkoczU59aBzw2GHZGhaly0j6eEes6ERFr2r7WToNSYZjD_pqmmjMqa8oPSJEs-7HakbLbIvc4v-EcKrZlcOTWof8OoqBvA7UP9BcCAsz7xTBkY3o_j0OaL6w0pWhMqsXfKh2l4GJYAGzxkLmO1ZvzandJqo9svSPJRvBGTnmBV0Im_Ss7yqY3egaGTjQEIfvovtkLyniMbu2X1Dyt'
    },
    {
      id: 'trn-3',
      name: 'Bruce Lee',
      specialty: 'Martial Arts & Flexibility',
      rating: 4.9,
      activeClients: 15,
      weeklyHours: 30,
      status: 'On Leave',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUHOForGxarXAiGixpvCZhaNi3fs2N-6-tXL-1poyyRfeZ6ha5AmcwN7WxS5w18Ted3h14fS6WmDNXTalx-INxDGYAuhN_M5Km7fmXjNgzkcjkwG0ns4JD_vF0APyC-ZDyvo7YBnlYNdP6T9fV1pDwQV188fujaJGfj6Fcc5Ea1QFfcAwKFy41WB-9lSmRar0FYiMZJ0jDStZqPHAbR6aKzMpDmCPrq_yHWKqlABKLIYBmPaS3kUTdr9DbK2fVptfS9z6hBYJ7cpbS'
    }
  ]);

  // 3. Plans Signals
  plans = signal<GymPlan[]>([
    { id: 'pln-1', name: 'Kinetic Starter', price: 49, billingPeriod: 'month', features: ['Gym Access', 'Locker Room Access', '1 Fitness Assessment'], activeMembers: 145, status: 'active' },
    { id: 'pln-2', name: 'Elevate Pro', price: 89, billingPeriod: 'month', features: ['24/7 Gym Access', 'All Group Classes', '5 Trainer Slots / Mo', 'Sauna Access'], activeMembers: 320, status: 'active' },
    { id: 'pln-3', name: 'Elite Performance', price: 149, billingPeriod: 'month', features: ['Unlimited 1-on-1 Coaching', 'Custom Nutritional Plans', 'All Group Classes & SPA', 'VIP Recovery Lounge'], activeMembers: 84, status: 'active' }
  ]);

  // 4. Payments Signals
  payments = signal<PaymentRecord[]>([
    { id: 'TXN-9021', memberName: 'Aria Montgomery', amount: 89, date: '2026-06-14', status: 'Paid', method: 'Credit Card' },
    { id: 'TXN-9020', memberName: 'Bruce Wayne', amount: 149, date: '2026-06-13', status: 'Paid', method: 'Bank Transfer' },
    { id: 'TXN-9019', memberName: 'Diana Prince', amount: 89, date: '2026-06-13', status: 'Failed', method: 'Credit Card' },
    { id: 'TXN-9018', memberName: 'Clark Kent', amount: 49, date: '2026-06-12', status: 'Paid', method: 'PayPal' },
    { id: 'TXN-9017', memberName: 'Tony Stark', amount: 149, date: '2026-06-11', status: 'Pending', method: 'Bank Transfer' }
  ]);

  // 5. Attendance Signals
  attendance = signal<AttendanceRecord[]>([
    { id: 'att-1', memberName: 'Bruce Wayne', checkInTime: '11:15 AM', method: 'QR Code', status: 'Success' },
    { id: 'att-2', memberName: 'Clark Kent', checkInTime: '10:45 AM', method: 'RFID Card', status: 'Success' },
    { id: 'att-3', memberName: 'Lois Lane', checkInTime: '10:10 AM', method: 'QR Code', status: 'Success' },
    { id: 'att-4', memberName: 'Arthur Curry', checkInTime: '08:30 AM', method: 'Manual Scan', status: 'Success' }
  ]);

  // 6. Activity Logs Signals
  activityLogs = signal<ActivityLog[]>([
    { id: 'log-1', timestamp: '2026-06-14 11:30', category: 'Security', message: 'Admin login detected from IP 192.168.1.15', adminName: 'System' },
    { id: 'log-2', timestamp: '2026-06-14 10:45', category: 'Membership', message: 'New member Clark Kent registered successfully', adminName: 'Elevate Admin' },
    { id: 'log-3', timestamp: '2026-06-14 09:15', category: 'Financial', message: 'Invoice TXN-9021 processed for Aria Montgomery', adminName: 'System' },
    { id: 'log-4', timestamp: '2026-06-13 18:00', category: 'Trainer', message: 'Trainer Bruce Lee updated status to On Leave', adminName: 'System' }
  ]);

  // Helper actions
  addUser(user: Omit<User, 'id' | 'lastActive'>) {
    const newUser: User = {
      ...user,
      id: `usr-${Date.now()}`,
      lastActive: 'Never'
    };
    this.users.update(list => [newUser, ...list]);
    this.logActivity('Security', `User account created for ${user.name} (${user.role})`);
  }

  toggleUserStatus(id: string) {
    this.users.update(list => list.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
  }

  deleteUser(id: string) {
    const user = this.users().find(u => u.id === id);
    this.users.update(list => list.filter(u => u.id !== id));
    if (user) {
      this.logActivity('Security', `User account deleted for ${user.name}`);
    }
  }

  toggleTrainerStatus(id: string) {
    this.trainers.update(list => list.map(t => t.id === id ? { ...t, status: t.status === 'Active' ? 'On Leave' : 'Active' } : t));
  }

  addPlan(plan: Omit<GymPlan, 'id' | 'activeMembers' | 'status'>) {
    const newPlan: GymPlan = {
      ...plan,
      id: `pln-${Date.now()}`,
      activeMembers: 0,
      status: 'active'
    };
    this.plans.update(list => [...list, newPlan]);
    this.logActivity('Membership', `New plan '${plan.name}' created`);
  }

  addPayment(pay: Omit<PaymentRecord, 'id' | 'date'>) {
    const newPay: PaymentRecord = {
      ...pay,
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0]
    };
    this.payments.update(list => [newPay, ...list]);
  }

  checkInMember(name: string, method: 'RFID Card' | 'QR Code' | 'Manual Scan' = 'Manual Scan') {
    const newAtt: AttendanceRecord = {
      id: `att-${Date.now()}`,
      memberName: name,
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      method,
      status: 'Success'
    };
    this.attendance.update(list => [newAtt, ...list]);
    this.logActivity('Membership', `Member ${name} checked in via ${method}`);
  }

  logActivity(category: ActivityLog['category'], message: string) {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      category,
      message,
      adminName: 'Elevate Admin'
    };
    this.activityLogs.update(list => [newLog, ...list]);
  }
}
