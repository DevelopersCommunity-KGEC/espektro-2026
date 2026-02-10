# Espektro Event & Ticketing Platform — PRD (v2)

**Status:** Approved for Development

**Architecture:** Club-centric, role-scoped, QR-based ticketing system | Feature-First Codebase

---

## 1. Executive Summary

**Espektro** is a web-based event and ticketing platform designed for large college fests with multiple clubs running parallel events. The system enables clubs to independently manage events, volunteers, and ticket issuance while remaining under a unified platform controlled by Super Admins.

The platform supports:

- Club-based event ownership
- Role-based access control (RBAC) with per-club and per-event scope
- Online and manual ticket issuance (Unlimited for admins)
- Secure QR-based entry validation
- High-concurrency scanning during fest days

The system is designed to scale to **30–50 events**, **thousands of tickets**, and **simultaneous check-ins** without operational friction.

---

## 2. Core System Interfaces

1. **Public / Student Interface**
   - Event discovery
   - Ticket booking & payment
   - Ticket QR display

2. **Club Dashboard**
   - Club-scoped event management
   - Volunteer & editor management
   - Club ticket issuance

3. **Admin Dashboard**
   - Global control (clubs, users, roles)
   - Bulk & manual ticket issuance
   - Analytics and audit logs

4. **Security / Scanner Interface**
   - Mobile-first QR scanning
   - Real-time validation
   - Offline-safe scanning support

---

## 3. Technology Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict)
- **Backend:** Next.js Server Actions
- **Database:** MongoDB Atlas
- **ODM:** Mongoose
- **Auth:** BetterAuth (Google OAuth)
- **Payments:** Razorpay
- **Validation:** Zod
- **UI:** Tailwind CSS + Shadcn/UI
- **QR Generation:** `qrcode`
- **QR Scanning:** `html5-qrcode`

---

## 4. Roles & Access Model

### Global Roles

- **Super Admin** – Full platform control
- **User** – Default student role

### Club-Scoped Roles

- **Club Admin** – Manages club, events, volunteers
- **Volunteer** – Event check-in only
- **Event Editor** – Edit-only access to specific events

> Permissions are enforced using both **RBAC** and **object-level scope checks** (clubId / eventId).

---

## 5. Data Model Overview

### Clubs

- Own events
- Maintain their own admins & volunteers

### Users

- Global role
- Optional club-scoped roles

### Events

- Always belong to a club
- Can have per-event editors

### Tickets

- Issued via payment or manual flow
- Bound to event
- Represented by secure QR token

### Audit Logs

- Immutable history of sensitive actions

---

## 6. Functional Requirements

### 6.1 Event Discovery

- Public landing page with event grid
- Club filter & tags
- Event detail page with rules, venue, pricing

### 6.2 Ticket Booking Flow

1. User clicks **Get Ticket**
2. Authentication enforced
3. Payment order created (server action)
4. Razorpay checkout
5. Payment verification
6. Ticket created + QR token generated
7. Redirect to **My Tickets**

Capacity enforcement must be **atomic**.

---

### 6.3 My Tickets

- List of booked tickets
- Grouped by club & event
- QR display (UUID token only)

---

### 6.4 Club Dashboard

**Club Admin Capabilities:**

- Create/edit events for their club
- Assign volunteers & event editors
- View club analytics
- View specific Referral Leaderboard (User Attribution)
- Issue manual tickets (if permitted)

---

### 6.5 Manual Ticket Issuance

- Single email
- Bulk CSV upload
- Fest-day / season pass support
- Audit log for every issuance

---

### 6.6 Scanner / Check‑In System

- Restricted to Security, Admin, Volunteers
- Event or club context selection
- QR validation logic:
  - Invalid → Reject
  - Already checked-in → Warn
  - Valid → Check-in + timestamp

Scanner must respond in **< 500 ms**.

---

### 6.7 User Profile & Gamification

- **Referral Code:** Every user has a unique, deterministic referral code (derived from email).
- **Stats:** Users can view their total referrals and revenue generated.
- **Ambassador Program:** "Referral" is strictly for attribution (tracking who brought whom). "Coupons" are separate entities for discounts.

---

### 6.8 Referral Leaderboards

- **Global Leaderboard:** available to Super Admins (Top referrers across fest).
- **Club Leaderboard:** available to Club Admins (Top referrers for specific club events).
- **Metrics:** Track `Total Tickets Sold` and `Total Revenue Generated`.

---

### 6.9 Coupon System

- **Purpose:** Provide percentage-based discounts to specific users.
- **Scope:** Can be global (`'all'`) or scoped to a specific `clubId`.
- **Usage:** Single-use codes (`isUsed` flag).
- **Management:** Admins can generate and view usage status.
- **Schema:** Tracks `code`, `discountPercentage`, `usedBy`, and `clubId`.

---

## 7. Security & Validation

- QR tokens are cryptographically random
- No database IDs inside QR
- Idempotent scan operations
- Strict middleware protection per route
- Rate limiting on scan & booking APIs

---

## 8. Non‑Functional Requirements

- **Performance:** <500 ms scan response
- **Concurrency:** Safe under burst traffic
- **Availability:** Scanner must tolerate intermittent connectivity
- **Responsiveness:** Mobile-first for scanner UI

---

## 9. Quality & Testing

- Booking race-condition tests
- Scanner double-scan tests
- Migration dry-run tests

---

## 10. Deployment Principles

- Feature-flagged rollout
- Backward-compatible schema changes
- Zero data loss migration
- Observable logs & metrics

---

## 11. Codebase Architecture

To ensure scalability and developer experience, the project follows a **Feature-First Architecture**:

### 11.1 Folder Structure

- **`src/components/events/`** - Event forms, lists, and booking UI.
- **`src/components/clubs/`** - Club dashboards, volunteer management.
- **`src/components/tickets/`** - Ticket rendering and validation.
- **`src/components/skeletons/`** - Reusable loading state placeholders.
- **`src/components/admin/`** - Global admin tools.
- **`src/components/layout/`** - Shell components (Navbar, Sidebar).
- **`src/types/`** - Centralized strict TypeScript definitions (e.g., `events.ts`, `tickets.ts`).

### 11.2 Design Principles

- **Strict Typing:** No usage of `any`. All data shapes are defined in `src/types`.
- **Server Actions:** All mutations are handled via Server Actions in `src/actions`.
- **RBAC Enforcement:** Permission checks are performed both at the UI level (checks) and Server Action level (enforcement).
- **Kebab-Case Naming:** All files use kebab-case (e.g., `event-form.tsx`).

---

**This PRD fully replaces the v1 single-event architecture and reflects the new club-based system shown in the high-level design diagram.**
