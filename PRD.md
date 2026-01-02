This is a comprehensive Product Requirement Document (PRD) for the **Espektro Event & Ticketing Platform**. This document is designed to be handed directly to developers, UI/UX designers, and QA testers.

---

# Product Requirement Document (PRD): Espektro Ticketing Platform

| **Project Name** | Espektro Event Platform                                                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Version**      | 1.1                                                                                                                            |
| **Status**       | **Approved for Development**                                                                                                   |
| **Primary Goal** | To facilitate event showcasing, ticket booking, payment processing, and entry management via QR scanning for the college fest. |

---

## 1. Executive Summary

**Espektro** is a web-based platform for a college fest featuring 30-40 distinct events. It serves as the central hub for students to discover events, purchase tickets via a payment gateway, and manage their entry passes.

The system features three distinct interfaces:

1. **Public/Student Interface:** For browsing and booking.
2. **Security Interface:** A mobile-first view for scanning QR codes at venue gates.
3. **Admin Dashboard:** For event management, manual ticketing, and financial analytics.

---

## 2. Technology Stack & Architecture

The application will use a **Monolithic architecture** leveraging the latest React features.

- **Framework:** **Next.js 16 (App Router)**.
- **Language:** TypeScript (Strict mode).
- **Backend Logic:** **Next.js Server Actions** (No separate backend server; direct database communication from server components/actions).
- **Database:** **MongoDB** (Atlas).
- **ORM/ODM:** **Mongoose** (v9+).
- **Authentication:** **BetterAuth** (Provider: Google OAuth).
- **Payment Gateway:** Razorpay.
- **Validation:** **Zod** (for form and API validation).
- **Styling:** Tailwind CSS + Shadcn/UI (for rapid UI development).
- **QR Generation:** `qrcode` library.
- **QR Scanning:** `html5-qrcode` library.

---

## 3. User Roles & Permissions Matrix

The system relies on Role-Based Access Control (RBAC) and Per-Event Permissions.

| Feature                 | Guest (Unauthenticated) | Student (User) | Security | Ticket Issuer | Admin | Event Editor (Per Event) |
| ----------------------- | ----------------------- | -------------- | -------- | ------------- | ----- | ------------------------ |
| View Events             | ✅                      | ✅             | ✅       | ✅            | ✅    | ✅                       |
| **Book Tickets**        | ❌ (Redirects to Login) | ✅             | ✅       | ✅            | ✅    | ✅                       |
| **Access "My Tickets"** | ❌                      | ✅             | ✅       | ✅            | ✅    | ✅                       |
| **Scan QR Codes**       | ❌                      | ❌             | ✅       | ❌            | ✅    | ❌                       |
| **Dashboard Access**    | ❌                      | ❌             | ❌       | ✅            | ✅    | ❌                       |
| **Create Events**       | ❌                      | ❌             | ❌       | ❌            | ✅    | ❌                       |
| **Edit Events**         | ❌                      | ❌             | ❌       | ❌            | ✅    | ✅ (Specific Event Only) |
| **Manual Ticket Issue** | ❌                      | ❌             | ❌       | ✅ (Quota)    | ✅    | ❌                       |
| **Manage User Roles**   | ❌                      | ❌             | ❌       | ❌            | ✅    | ❌                       |

> **Note:** "Event Editor" is not a global user role. It is a permission granted to specific users (via email) for specific events.

---

## 4. Database Schema Design (MongoDB)

This is the implemented schema structure.

### A. Users Collection

```typescript
{
  _id: ObjectId,
  name: String,
  email: String, // Unique, from Google
  image: String, // from Google
  role: String, // Enum: ['user', 'security', 'admin', 'ticket-issuer'] - Default: 'user'
  ticketQuota: Number, // For ticket-issuer role
  createdAt: Date
}
```

### B. Events Collection

```typescript
{
  _id: ObjectId,
  title: String,
  description: String,
  image: String, // URL
  date: Date,
  venue: String,
  price: Number,
  capacity: Number,
  ticketsSold: Number, // Increment on sale
  isVisible: Boolean, // To hide events if needed
  editors: [String], // Array of User Emails permitted to edit this event
  type: String, // Enum: ['fest-day', 'event']
}
```

### C. Tickets Collection

```typescript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to Users (can be null if manual generic ticket, but preferred linked)
  userEmail: String, // Stored for manual assignment before user creates account
  eventId: ObjectId, // Reference to Events
  paymentId: String, // Transaction ID from Payment Gateway
  qrCodeToken: String, // Unique UUID/Hash for the QR code
  status: String, // Enum: ['booked', 'checked-in', 'cancelled']
  purchaseDate: Date,
  checkInTime: Date // Null initially, populated upon scan
}

```

---

## 5. Detailed Feature Requirements & User Flow

### 5.1. Authentication (BetterAuth)

- **Login:** Users utilize "Continue with Google".
- **Session Management:** Handled via HTTP-only cookies.
- **Role Logic:** On first login, check a hardcoded list of Admin Emails in environment variables. If match -> assign `admin`. Else -> `user`. Security roles are manually assigned by Admin later.

### 5.2. Event Discovery (Public)

- **Landing Page:** Hero section with "Espektro" branding.
- **Event Grid:** List of 30-40 events with Title, Date, Price, and "Book Now" button.
- **Event Details:** A specific page `/events/[id]` showing full description and rules.

### 5.3. Booking Flow (Critical Path)

1. User clicks **"Get Ticket"**.
2. **Check Auth:**

- If Logged out → Redirect to `/login` → Return to Event page.
- If Logged in → Proceed.

3. **Payment Processing:**

- User clicks "Pay [Amount]".
- **Server Action:** Create Order ID on Gateway.
- Client opens Payment Modal.
- **On Success:** Gateway triggers webhook or Client verifies payment via Server Action.

4. **Ticket Generation:**

- Create `Ticket` document in MongoDB.
- Increment `ticketsSold` in Event document.
- Redirect user to `/my-tickets`.

### 5.4. My Tickets Section

- Route: `/my-tickets` (Protected).
- Display a list of upcoming events the user has booked.
- **Ticket Card:** Shows Event Name, Venue, Date.
- **Action:** Click "View QR".
- **QR Display:** Renders a QR code containing the `qrCodeToken` (NOT the database ID, use a secure UUID).

### 5.5. Security Scanning Module

- Route: `/scan` (Protected: Only `security` and `admin` roles).
- **UI:**
  - "Start Scanning" button to initiate camera.
  - Full-screen camera view using `html5-qrcode`.
  - Instant feedback (Green/Red) with sound/visual cues.
  - "Scan Next" button to reset for the next attendee.
- **Logic (Server Action: `verifyTicket(token)`):**

1. Search `Tickets` collection for `qrCodeToken`.
2. **Scenario A (Not Found):** Return Error "Invalid Ticket / Fake QR".
3. **Scenario B (Found & Status == 'checked-in'):** Return Warning "Already Scanned at [Time]".
4. **Scenario C (Found & Status == 'booked'):**

- Update status to `checked-in`.
- Update `checkInTime` to `now`.
- Return Success "Access Granted".

### 5.6. Admin Dashboard

- **Overview Stats:** Total Revenue, Total Tickets Sold, Check-in Count.
- **Event Management:**
  - **CRUD Operations:** Add/Edit/Delete events (Forms with Zod validation).
  - **Event Editors:** Admins can assign specific users as **Editors** to a particular event by adding their email addresses. These users gain permission to edit that specific event's details.
- **User Role Management:**
  - **Search & Edit:** Admin can search for any user by their **Email Address**.
  - **Role Assignment:** Admin can assign roles: `user`, `security`, `admin`, or `ticket-issuer`.
  - **Quota Management:** For `ticket-issuer` role, Admin can assign a specific `ticketQuota` (number of tickets they can issue).
- **Manual Ticket Assignment:**
  - **Single Issue:** Issue a ticket for a specific event to a specific email.
  - **Season Pass:** Issue tickets for all "Fest Day" events at once.
  - **Bulk Issue:** Support for comma-separated emails to issue tickets/passes to multiple users in one go.
  - **Quota Deduction:** For `ticket-issuer`, the cost (1 per ticket) is deducted from their quota. Admin has unlimited quota.

---

## 6. Technical Implementation Guidelines

### 6.1. Folder Structure (Next.js App Router)

```text
/src
  /app
    /(public)          # Public routes
      /page.tsx        # Landing
      /events/[id]     # Event Details
    /(auth)            # Login pages
    /(protected)       # Requires Login
      /my-tickets      # User tickets
    /(admin)           # Admin layout
      /dashboard
      /scan            # Scanner (Security layout)
  /components          # UI Components
  /lib
    /db.ts             # Mongo Connection
    /auth.ts           # BetterAuth config
  /actions             # Server Actions (Backend Logic)
    /book-ticket.ts
    /scan-ticket.ts
    /admin-actions.ts
  /models              # Mongoose Models

```

### 6.2. Security & Validations

1. **Middleware:** strict `middleware.ts` file to block `/dashboard` for non-admins and `/scan` for non-security users.
2. **Atomic Transactions:** When booking a ticket, ensure the payment is verified _before_ the ticket is created in the DB to prevent free tickets.
3. **QR Security:** The QR code payload should be a UUID, not a sequential ID, to prevent users from guessing the next QR code.

---

## 7. Development Phases

### Phase 1: Setup & Auth (Days 1-2)

- Initialize Next.js project.
- Setup MongoDB connection.
- Configure BetterAuth with Google.
- Define Mongoose Models.

### Phase 2: Events & Public Facing (Days 3-4)

- Create Admin page to seed/upload 30-40 events.
- Build Landing page and Event Listing page.

### Phase 3: Booking System (Days 5-7)

- Integrate Payment Gateway (Test Mode).
- Build Server Actions for order creation and verification.
- Develop "My Tickets" page with QR generation.

### Phase 4: Scanning & Admin (Days 8-9)

- Build the Scanner UI.
- Implement Validation Logic (The "Access Granted/Denied" logic).
- Finalize Admin Dashboard analytics and Manual Ticket assignment.

### Phase 5: Testing & Deployment (Day 10)

- Load testing (ensure scan API is fast).
- Role testing (try to access admin pages as a student).
- Deployment to Vercel/AWS.

---

## 8. Non-Functional Requirements

1. **Performance:** The Scan API response time must be under **500ms** to ensure queues don't build up at the gate.
2. **Responsiveness:** The Website must be fully responsive. The Scanner page must work perfectly on mobile browsers (Chrome/Safari).
3. **Concurrency:** Ensure MongoDB connection pooling is handled correctly so the database doesn't crash during high traffic booking windows.

---
