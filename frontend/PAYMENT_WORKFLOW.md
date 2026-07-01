# Payment Workflow

## 1. Registration → Plan Selection

```
User fills form → OTP verification → Clicks "Register"
```

| Step | Action | Endpoint | Response |
|------|--------|----------|----------|
| 1 | Register form submitted | `POST /api/v1/auth/register` | `{ token, memberId, user }` |
| 2 | Auto-login (store token + user) | — | `localStorage.setItem('token', ...)` |
| 3 | Redirect | — | `/select-plan` |

- Backend creates a **User** (auth) and a **Member** (profile) simultaneously
- JWT token is returned so the user is logged in immediately
- The auth interceptor attaches the token to all subsequent requests

---

## 2. Login → Role-Based Redirect

```
User enters email/password → Clicks "Login"
```

| Role | Redirect Route |
|------|----------------|
| `admin` | `/admin/dashboard` |
| `trainer` | `/trainer/dashboard` |
| `member` | `/member/dashboard` |

Logic in `login.ts:34-44`:

```typescript
const role = res.user.role;
if (role === 'admin')       this.router.navigate(['/admin/dashboard']);
else if (role === 'trainer') this.router.navigate(['/trainer/dashboard']);
else                         this.router.navigate(['/member/dashboard']);
```

---

## 3. Plan Selection Page (`/select-plan`)

**Components involved:**
- `features/plan-selection/plan-selection.ts` (host page)
- `shared/components/plans/plans.ts` (plan cards + skip button)

**Flow:**

```
[GET /api/v1/plans] ──► renders plan cards with [Select] [Skip]
```

| Action | Result |
|--------|--------|
| **Skip** | Navigate to `/member/dashboard` (no plan assigned) |
| **Select** | Store selected plan → show `<app-payment>` component |

---

## 4. Select → Razorpay Payment

```
User clicks "Select" on a plan → Payment screen appears
```

**Components involved:**
- `shared/components/payment/payment.ts`

**Flow:**

```
┌─ User clicks "Pay ₹XXX"
│
├─ POST /api/v1/payments/create-order  { amount }
│      │
│      └─ Backend creates Razorpay order (amount × 100 paise)
│         └─ Returns { order_id, amount, currency }
│
├─ Razorpay checkout modal opens (using order_id)
│      │
│      ├─ User completes payment
│      │    └─ handler receives { razorpay_order_id, razorpay_payment_id, razorpay_signature }
│      │
│      └─ POST /api/v1/payments/verify  {
│            razorpay_order_id,
│            razorpay_payment_id,
│            razorpay_signature,
│            memberId, planId, amount
│          }
│
└─ Backend verifies HMAC signature → saves Payment record (status: "paid")
```

**Signature verification (backend):**

```javascript
const body = razorpay_order_id + '|' + razorpay_payment_id;
const expectedSignature = crypto
  .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
  .update(body)
  .digest('hex');

if (expectedSignature !== razorpay_signature) {
  return res.status(400).json({ message: 'Invalid signature' });
}
```

---

## 5. Post-Payment → Plan Assignment

```
Payment verified → onPaymentSuccess() fires
```

| Step | Action | Endpoint |
|------|--------|----------|
| 1 | Payment verified by `/verify` | `POST /api/v1/payments/verify` |
| 2 | Update member's plan + status | `PATCH /api/v1/members/me/plan { planId }` |
| 3 | Navigate to dashboard | `/member/dashboard` |

The `PATCH /api/v1/members/me/plan` controller sets **both** fields:

```javascript
Member.findOneAndUpdate(
  { email: req.user.email },
  { membershipPlan: planId, membershipStatus: 'active' },
  { new: true }
)
```

---

## 6. Member Dashboard

**Components involved:**
- `features/member/dashboard/dashboard.ts`

**On load:**

| Step | Endpoint | Purpose |
|------|----------|---------|
| 1 | `GET /api/v1/members/me` | Fetch logged-in member's profile |
| 2 | `GET /api/v1/plans/:id` | Fetch plan details (if assigned) |

**Display:**
- Welcome card with member name + membership status badge
- Plan card (name, price, features) or "No plan selected" link
- Profile card (email, phone, age, gender)
- Trainer card + Goals card

---

## 7. All Endpoints Involved

### Frontend → Backend

| Method | Path | Auth | Role | Purpose |
|--------|------|------|------|---------|
| `POST` | `/api/v1/auth/register` | No | — | Register user + create member |
| `POST` | `/api/v1/auth/login` | No | — | Login, get JWT token |
| `GET` | `/api/v1/plans` | Yes | any | List all plans |
| `GET` | `/api/v1/plans/:id` | Yes | any | Get single plan |
| `POST` | `/api/v1/payments/create-order` | Yes | admin/receptionist/member | Create Razorpay order |
| `POST` | `/api/v1/payments/verify` | Yes | admin/receptionist/member | Verify payment + save record |
| `PATCH` | `/api/v1/members/me/plan` | Yes | member | Update plan + set status to active |
| `GET` | `/api/v1/members/me` | Yes | member | Get own member profile |

---

## 8. Data Flow Diagram

```
BROWSER                          BACKEND                       RAZORPAY
  │                                │                             │
  │  ── POST /auth/register ──────►│                             │
  │◄──── { token, user } ─────────┤                             │
  │                                │                             │
  │  ── GET /plans ───────────────►│                             │
  │◄────── { plans[] } ───────────┤                             │
  │                                │                             │
  │  ── POST /payments/create-order►│                             │
  │                                ├── razorpay.orders.create───►│
  │◄────── { order_id } ──────────┤◄──────── order ────────────┤
  │                                │                             │
  │  ── Razorpay Checkout ────────┼────────────────────────────►│
  │◄─ { payment_id, signature } ──┼─────────────────────────────┤
  │                                │                             │
  │  ── POST /payments/verify ────►│                             │
  │◄────── { success } ───────────┤                             │
  │                                │                             │
  │  ── PATCH /members/me/plan ───►│                             │
  │◄────── { success } ───────────┤                             │
  │                                │                             │
  │  ── GET /members/me ──────────►│                             │
  │◄────── { member } ────────────┤                             │
  │                                │                             │
```

---

## 9. Key Files

| File | Role |
|------|------|
| `frontend/src/app/features/auth/register/` | Registration form + auto-login |
| `frontend/src/app/features/auth/login/` | Login + role-based redirect |
| `frontend/src/app/features/plan-selection/` | Plan list → payment → activation |
| `frontend/src/app/shared/components/plans/` | Reusable plan cards + skip button |
| `frontend/src/app/shared/components/payment/` | Razorpay checkout integration |
| `frontend/src/app/features/member/dashboard/` | Member's post-login home |
| `backend/controllers/authController.js` | Register (returns JWT) + login |
| `backend/controllers/paymentController.js` | Create order + verify payment |
| `backend/controllers/memberController.js` | Update plan + status, get profile |
| `backend/models/payment.js` | Payment schema (method enum includes "online") |
| `backend/models/member.js` | Member schema (plan ref: "Plan", status field) |
