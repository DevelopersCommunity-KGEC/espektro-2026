# Espektro 2026 | Event & Ticketing Platform

Official ticketing and event management platform for **Espektro 2026**, the annual cultural fest of **Kalyani Government Engineering College (KGEC)**.
//espektro
## 🚀 Overview

This platform enables multiple college clubs to independently manage their events, issue tickets, and handle payments under a unified system. It features a robust Role-Based Access Control (RBAC) system, secure QR code ticketing, and real-time check-in capabilities.

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Database:** MongoDB Atlas (via Mongoose)
- **Authentication:** BetterAuth (Google OAuth)
- **Styling:** Tailwind CSS + [Shadcn/UI](https://ui.shadcn.com/)
- **Payments:** Razorpay
- **Validation:** Zod
- **QR Operations:** `qrcode` (generation) & `html5-qrcode` (scanning)

## ✨ Key Features

- **Club-Centric Architecture:** Each club (Music, Dance, Coding, etc.) manages its own events.
- **Role-Based Access Control (RBAC):**
  - **Super Admin:** Global control.
  - **Club Admin:** Full control over club events.
  - **Volunteer:** Restricted to scanning and check-in.
- **Ticketing System:**
  - Secure QR code generation (signed tokens).
  - Online payments via Razorpay.
  - Unlimited manual issuance for admins.
- **Fast Check-in:** Optimized mobile-first scanner responding in <500ms.

## 🏗️ Architecture

The project follows a **Feature-First Architecture** to ensure scalability and maintainability.

```text
src/
├── actions/            # Server Actions for mutations (db logic)
├── app/                # Next.js App Router (pages & routing)
├── components/         # Feature-based component organization
│   ├── admin/          # Admin dashboard components
│   ├── clubs/          # Club management & user lists
│   ├── events/         # Event forms, cards, and modals
│   ├── layout/         # Navbar, Sidebar, and shell wrappers
│   ├── tickets/        # Ticket rendering and interaction
│   └── ui/             # Reusable UI primitives (buttons, inputs)
├── lib/                # Utilities, auth config, db connection
├── models/             # Mongoose schemas (User, Event, Ticket)
└── types/              # Strict TypeScript definitions
```

## 🏁 Getting Started

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-org/espektro-2026.git
    cd espektro-2026
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory with the following variables:

    ```env
    MONGODB_URI=...
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    BETTER_AUTH_SECRET=...
    GOOGLE_CLIENT_ID=...
    GOOGLE_CLIENT_SECRET=...
    RAZORPAY_KEY_ID=...
    RAZORPAY_KEY_SECRET=...
    ADMIN_EMAILS=your.email@example.com
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

5.  **Build for production:**
    ```bash
    npm run build
    npm start
    ```

## 🤝 Contribution Guidelines

- **Strict Typing:** Avoid `any` types. Define interfaces in `src/types/`.
- **Kebab-Case:** Use kebab-case for all filenames (e.g., `event-form.tsx`).
- **Server Actions:** Use Server Actions for all database mutations.
- **Icons:** Use `lucide-react` for icons.

## 📄 License

This project is proprietary to Kalyani Government Engineering College.
