# Hostel Mess Management System

## Major Project Report (Submission Draft)

Submitted by: ____________________  
Roll Number: ____________________  
Branch/Semester: ____________________  
Institution: ____________________  
Academic Session: ____________________

Guide Name: ____________________  
Department: ____________________

---

## Certificate

This is to certify that the project titled "Hostel Mess Management System" has been carried out by ____________________ under my supervision and guidance as part of the degree requirement.

Guide Signature: ____________________  
Date: ____________________

---

## Candidate Declaration

I hereby declare that the project report titled "Hostel Mess Management System" submitted by me is an original work carried out during the academic session and has not been submitted previously for any degree or diploma.

Candidate Signature: ____________________  
Date: ____________________

---

## Acknowledgement

I express my sincere gratitude to my project guide, department faculty, and institution for their guidance and support throughout this project. I also thank my friends and family for their encouragement and valuable feedback during the analysis, development, and documentation phases.

---

## Abstract

The Hostel Mess Management System is a role-based web application designed to digitize day-to-day hostel operations. The project addresses common challenges in hostel administration, such as manual complaint handling, non-transparent leave approvals, and limited visibility into mess operations. The system provides separate workflows for students, wardens, and administrators through a single responsive interface.

The implemented application includes login-based access, dashboard analytics views, complaint tracking, leave request management, hostel information pages, mess menu views, feedback interfaces, and QR attendance flow screens. The frontend is developed using Next.js, React, TypeScript, Tailwind CSS, and reusable UI components. For backend readiness, core Prisma models and migration SQL are implemented for users, complaints, and leave requests, along with core API routes for auth login, complaints, leave requests, and profile operations.

In its current submission form, the system demonstrates a complete functional prototype with partial production-ready backend foundations. The design emphasizes usability, mobile responsiveness, and modular code organization. Remaining work for full production includes moving dashboard flows from mock/local state to API consumption, implementing all pending API modules, and hardening security policies.

Keywords: Hostel Management, Mess Management, Complaint Tracking, Leave Workflow, Role-Based Access, Next.js, React, TypeScript

---

## Table of Contents

1. Introduction  
2. Problem Statement  
3. Objectives  
4. Scope  
5. Requirement Analysis  
6. Technology Stack  
7. System Design and Architecture  
8. Module-Wise Working  
9. Database and Data Design  
10. API and Backend Readiness  
11. Security and Authentication  
12. Implementation Details  
13. Testing and Validation  
14. Results and Outcomes  
15. Limitations  
16. Future Scope  
17. Conclusion  
18. References  
19. Appendix

---

## Implementation Status Summary

### Implemented in This Submission

1. Role-based UI and dashboards for student, warden, and admin views.
2. Prisma schema with core models: User, Complaint, LeaveRequest.
3. SQL migration file for core tables and enums.
4. Core authenticated API routes:
	- auth/login
	- complaints and complaints/[id]
	- leave-requests and leave-requests/[id]
	- users/profile
5. Minimal server-side middleware guard for dashboard routes.

### Planned / In Progress

1. Full conversion of frontend data flows from mock data to API data.
2. Completion of remaining placeholder API modules (mess, notifications, hostels, etc.).
3. Production-grade auth hardening and role policy enforcement across all endpoints.
4. Full automated test suite and deployment hardening.

---

## 1. Introduction

Hostel administration in many institutions still relies on notice boards, registers, and manual approvals. This causes delays, data duplication, and reduced transparency for students. Mess operations also suffer from communication gaps related to menu updates, attendance, and feedback collection.

The Hostel Mess Management System is developed as a centralized web platform to improve transparency, response time, and operational efficiency. It provides stakeholders with dedicated interfaces and module-level actions while keeping user experience simple and mobile-friendly.

---

## 2. Problem Statement

The existing manual or semi-digital hostel process creates several issues:

1. Complaint registration and follow-up are difficult to track.
2. Leave requests are often delayed and lack status visibility.
3. Mess communication is fragmented and feedback is not structured.
4. Admin and warden monitoring is not data-driven.
5. Student-facing information is scattered across channels.

A unified platform is required to address these issues with role-based workflows and structured records.

---

## 3. Objectives

The main objectives of this project are:

1. Build a centralized digital system for hostel and mess operations.
2. Provide clear role-based access for student, warden, and admin users.
3. Enable complaint and leave management with status visibility.
4. Improve communication through dashboards and notifications.
5. Ensure responsive UI for desktop and mobile use.
6. Keep architecture extensible for real database and API integration.

---

## 4. Scope

### In Scope

1. Role-based login experience.
2. Student dashboard and profile management.
3. Complaint listing, filtering, and submission flow screens.
4. Leave request listing and status tracking views.
5. Mess module with weekly menu, ratings, and attendance flow screens.
6. Hostel information display.
7. Role-specific navigation and dashboard layout.

### Out of Scope (Current Submission)

1. Complete production database schema for all modules beyond core tables.
2. Fully implemented REST API business logic for all route files beyond core APIs.
3. Server-side session enforcement and hardened middleware checks.
4. End-to-end automated test suite and deployment observability pipeline.

---

## 5. Requirement Analysis

### Functional Requirements

1. User should be able to sign in according to role.
2. Student should be able to view dashboard, mess, complaints, and leaves.
3. Warden should get dedicated management menu options.
4. Admin should get analytics and system management menu options.
5. User should be able to view status-based cards and filtered records.
6. UI should support navigation shortcuts and notifications.

### Non-Functional Requirements

1. Fast page load and smooth interaction.
2. Mobile-first responsive design.
3. Reusable component architecture.
4. Clear code organization for maintainability.
5. Accessibility-friendly structure and understandable UI labels.

### Hardware and Software Requirements

1. Node.js 18 or later.
2. npm or pnpm package manager.
3. Modern browser (Chrome, Edge, Firefox, Safari).
4. 4 GB RAM minimum (8 GB recommended for development).

---

## 6. Technology Stack

### Frontend

1. Next.js 15.2.4 (App Router)
2. React 19
3. TypeScript 5
4. Tailwind CSS 4
5. Radix UI and shadcn component pattern
6. Lucide icons
7. Framer Motion (animation support)

### Form and Validation

1. React Hook Form
2. Zod

### Backend and Data Readiness

1. Next.js API route structure present
2. Prisma ORM configured
3. PostgreSQL datasource configured in Prisma schema

### Additional Libraries in Project Dependencies

1. QR support (qrcode, html5-qrcode)
2. JWT and bcrypt dependencies
3. Socket.io dependencies
4. Recharts for analytics views
5. i18n-related dependencies
6. Chakra UI dependencies present along with Radix-based UI stack

---

## 7. System Design and Architecture

The current architecture follows a modular Next.js structure:

1. App Router pages in app directory.
2. Reusable UI and feature components in components directory.
3. Utility and auth logic in lib directory.
4. Prepared API route tree in app/api.
5. Prisma configuration in prisma directory.

### High-Level Flow

1. User opens login page.
2. Current UI login path validates demo credentials for presentation flow.
3. Core backend login API validates credentials against database and issues JWT cookie.
4. Middleware checks auth cookie for protected dashboard routes.
5. Role-based dashboard and sidebar items are rendered.
6. Module pages currently use a mix of mock data and API-ready structures.

### Role Architecture

1. Student role: dashboard, profile, mess, hostel, complaints, leave requests.
2. Warden role: resident operations and management-focused routes.
3. Admin role: user management, complaints overview, leave management, analytics, settings.

---

## 8. Module-Wise Working

### 8.1 Authentication and Role Access

1. Login form accepts credentials.
2. Demo-mode UI auth supports current dashboard walkthrough.
3. Server-side login API supports DB-backed authentication with JWT cookie.
4. Middleware enforces minimal server-side check for dashboard routes.
5. Role determines the available navigation and pages.

### 8.2 Dashboard Module

1. Displays welcome section and quick summary cards.
2. Includes quick action buttons for common tasks.
3. Shows recent activity and daily menu blocks.
4. Uses retry pattern for simulated API-loading resilience.

### 8.3 Complaint Module

1. Complaint cards show title, category, status, priority, and assignee.
2. Filters available for all, pending, and resolved states.
3. Summary cards provide status count overview.

### 8.4 Leave Request Module

1. Leave cards include leave type, dates, destination, and status.
2. Filters available for all, pending, approved, and rejected.
3. Rejection reason and approval information are shown conditionally.

### 8.5 Mess Module

1. Weekly menu layout with per-day meals.
2. Meal timing and ratings displayed for breakfast, lunch, snacks, dinner.
3. Quick navigation for attendance and feedback.
4. Highlights section shows top-rated and next meal information.

### 8.6 Hostel Module

1. Provides hostel details and student-facing facility information.
2. Includes contact and operational visibility content.

### 8.7 Notifications and Preferences

1. Notification dropdown and notification routes are scaffolded.
2. Preferences route structure is present for user-level settings.

### 8.8 QR Attendance Flow

1. QR component and route structure included.
2. Enables extension toward attendance scanning and verification.

---

## 9. Database and Data Design

### Current State in Submission

1. Prisma is configured with PostgreSQL provider.
2. Prisma client generation is configured.
3. Core domain models are defined in schema file (User, Complaint, LeaveRequest).
4. Initial migration SQL is added for core tables and enums.
5. Most module pages still consume mock/in-memory data at UI layer.

### Proposed Core Tables for Production

1. users
2. hostels
3. rooms
4. complaints
5. leave_requests
6. mess_menus
7. mess_feedback
8. attendance_logs
9. notifications

### Suggested Key Relationships

1. One hostel has many rooms and users.
2. One user can create many complaints and leave requests.
3. One mess menu can have many feedback entries.
4. Attendance log links user with meal and timestamp.

---

## 10. API and Backend Readiness

The project contains a broad API route structure under app/api for:

1. auth, auth/login, auth/register
2. complaints, complaints/[id], complaints/count
3. leave and leave-requests modules
4. mess/attendance, mess/menu, mess/feedback, mess/qr
5. users, users/count, users/profile
6. notifications and notifications/[id]
7. preferences, hostels, events, upload, backup

### Important Implementation Note

Core routes for auth login, complaints, leave requests, and user profile are implemented end-to-end with validation and authentication checks. Several other module routes remain placeholders, and the folder architecture supports progressive completion.

---

## 11. Security and Authentication

### Implemented in Current Version

1. Role-aware user context on client side.
2. Local storage user session persistence for current UI demo flow.
3. JWT cookie issuance in auth login API.
4. Minimal server-side middleware guard for dashboard routes.
5. Demo 2FA setup and token format verification endpoint.

### Current Limitation

1. UI login currently uses demo/local auth instead of consuming backend login API.
2. Role-based authorization checks are implemented only for core APIs, not all modules.
3. Authentication is not yet fully production hardened.

### Recommended Production Security Upgrades

1. Server-side JWT validation with secure HTTP-only cookies.
2. Strict middleware route guards by role.
3. Password policy with salted hashing and reset flow.
4. CSRF protection and rate limiting.
5. Audit logs for admin/warden actions.

---

## 12. Implementation Details

### UI and UX Highlights

1. Card-based dashboard design with responsive grid system.
2. Sidebar-driven role navigation with keyboard shortcuts.
3. Loading skeletons and error states for improved experience.
4. Theme toggle and notification access in top bar.

### Code Organization

1. Feature pages grouped in app/dashboard.
2. Generic components in components/ui.
3. Feature widgets in components/dashboard, components/mess, components/hostel, components/admin.
4. Shared utility logic in lib directory.

### Build and Run Commands

1. npm install --legacy-peer-deps
2. npm run dev
3. npm run build
4. npm run start

---

## 13. Testing and Validation

### Manual Testing Performed in Demo Mode

1. Login with student, warden, and admin demo credentials.
2. Navigation and role-based sidebar rendering checks.
3. Complaint and leave filter behavior checks.
4. Mess menu view and quick-action route checks.
5. Responsive behavior checks for mobile and desktop layouts.

### Suggested Formal Test Plan for Final Deployment

1. Unit tests for auth utilities and data transformers.
2. Integration tests for API routes and database operations.
3. End-to-end tests for complete user workflows.
4. Security tests for unauthorized route access.
5. Load tests for dashboard and report endpoints.

---

## 14. Results and Outcomes

1. A complete role-based frontend prototype has been successfully implemented.
2. Core hostel workflows are represented through clear modules and dashboards.
3. The application offers high usability through responsive design and modular components.
4. The codebase is organized to support smooth migration from mock data to persistent backend logic.
5. Submission is suitable for academic demonstration with clear extension pathways.

---

## 15. Limitations

1. Frontend is not fully migrated to database-backed API consumption in all modules.
2. Several API routes are scaffolded but still pending implementation.
3. Database models currently cover core modules only.
4. Production-grade auth and authorization hardening is incomplete.
5. Automated testing suite is not yet included.

---

## 16. Future Scope

1. Complete backend implementation for all API endpoints.
2. Full Prisma model design and database migrations.
3. Real-time notifications using socket events.
4. Payment integration for mess fee tracking.
5. Parent communication and approval portal.
6. Mobile application support.
7. Biometric or secure QR attendance verification enhancements.
8. Analytics export and institutional report generation.
9. Multilingual interface support.
10. AI-assisted complaint prioritization and routing.

---

## 17. Conclusion

The Hostel Mess Management System provides a strong digital foundation for modern hostel administration. The project successfully demonstrates how role-based workflows, structured UI modules, and extensible architecture can improve student services and operational visibility. Although backend persistence and security hardening are pending for production release, the current implementation is robust for major project demonstration and can be advanced into a deployable institutional platform with incremental development.

---

## 18. References

1. Next.js Official Documentation
2. React Official Documentation
3. TypeScript Handbook
4. Tailwind CSS Documentation
5. Prisma Documentation
6. Radix UI Documentation
7. Zod Documentation
8. React Hook Form Documentation

---

## 19. Appendix

### A. Demo Credentials

1. Student: student1@poornima.edu.in / password123
2. Warden: warden1@poornima.edu.in / password123
3. Admin: admin@poornima.edu.in / password123

### B. Suggested Submission Attachments

1. Project report PDF
2. Presentation slides
3. Screenshots of major modules
4. Source code folder
5. Optional demo video

### C. Suggested Screenshots List

1. Login page
2. Student dashboard
3. Mess module
4. Complaints module
5. Leave module
6. Warden navigation view
7. Admin analytics page
8. Mobile responsive dashboard
