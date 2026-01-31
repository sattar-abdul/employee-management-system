# Employee Management System

## Project Overview
This is a full-stack Employee Management System built for internship assessment task. This project is designed to handle internal HR operations, specifically focusing on **Role-Based Access Control (RBAC)** and automated **Leave Management**.

I focused on creating a seamless user experience where a single entry point handles three different levels of access: Super Admin, Admin, and Employee.

---

## 🛠 Tech Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Database:** MongoDB (via MongoDB Atlas)
- **Authentication:** Custom Middleware & Secure Cookies
- **Email Service:** Nodemailer (SMTP)
- **Styling:** Tailwind CSS

---

## 💡 Core Architecture & Human-Centric Features

### 1. The "Smart" Login Flow
Instead of forcing users to choose a portal, I built a **Common Login**. The system validates credentials, checks the user's status, and then automatically redirects them to the appropriate dashboard based on their role.

### 2. Multi-Tiered Security (Middleware)
I implemented a `middleware.ts` layer to protect the application. This ensures that even if a regular user knows the `/admin` URL, they are physically blocked from accessing it. 
- **Super Admin:** Can manage everyone and adjust leave quotas.
- **Admin:** Can manage users and approvals but is restricted from editing leave quotas (preserving budget/policy integrity).
- **User:** Restricted to their own data and team availability.

### 3. Ethical User Management
For the "Remove User" requirement, I implemented **Soft Deletes**. When an employee is removed, their status changes to `inactive`. This prevents them from logging in but preserves their historical leave data for HR reporting, which is a standard real-world practice.

Additionally I implemented the list of inactive users and an option to re-activate their id’s. (At Admin Panel)

### 4. Automated Leave Logic
- When an admin approves a request, the system calculates the duration and automatically decrements the user's remaining quota.
- **Real-time Notifications:** Once a decision is made, the system triggers an SMTP mailer to notify the employee immediately.
- For now I am using my own email to send mails, later it will be changed to Organization's email.

---

## 📂 Project Structure
To keep the code maintainable, I followed a modular directory structure:
- `/src/app/api` - Clean, separated API routes for auth, admin, and leaves.
- `/src/models` - Strictly typed Mongoose schemas.
- `/src/lib` - Centralized logic for DB connections and SMTP transport.
- `/src/components` - Reusable UI elements like the Logout handler.

---

## 🚀 Setup & Installation

1. **Install Dependencies:**
```bash
npm install
```

2. **Environment Configuration: Create a .env.local and add the following:**
```bash
MONGODB_URI=your_mongodb_uri
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

3. **Run the Project:**
```bash
npm run dev
```

---

## Summary
In this assessment, I prioritized code reliability. I added error handling for duplicate users, handled edge cases for date selections, and ensured that the role-based restrictions are enforced both on the Frontend (UI visibility) and the Backend (API security).

Looking forward to work with the real version of this project at IITD-AIA Foundation for Smart Manufacturing.
