# Hostel Mess Management System - Step-by-Step Workflow (Screenshot Wise)

## Figure 1 - Login Page

Image: [report_screenshots_perfect/01-login-page-fullscreen.png](report_screenshots_perfect/01-login-page-fullscreen.png)

Workflow Step:
The user opens the system and enters university email and password. The authentication layer validates credentials and role (Student, Warden, or Admin), then redirects to the role-specific dashboard.

## Figure 2 - Student Dashboard

Image: [report_screenshots_perfect/02-student-dashboard.png](report_screenshots_perfect/02-student-dashboard.png)

Workflow Step:
After login, the student lands on a personalized dashboard showing quick stats, recent activity, and shortcuts. This acts as the central control panel for daily hostel and mess operations.

## Figure 3 - Student Profile

Image: [report_screenshots_perfect/03-student-profile.png](report_screenshots_perfect/03-student-profile.png)

Workflow Step:
The student can view and update personal/contact details. Profile updates are validated and saved through API routes, ensuring accurate user identity and communication data.

## Figure 4 - Hostel Information

Image: [report_screenshots_perfect/04-student-hostel-info.png](report_screenshots_perfect/04-student-hostel-info.png)

Workflow Step:
The student accesses hostel details, rules, facilities, emergency contacts, and warden information. This improves transparency and provides quick access to important hostel support info.

## Figure 5 - Student Complaints

Image: [report_screenshots_perfect/05-student-complaints.png](report_screenshots_perfect/05-student-complaints.png)

Workflow Step:
The student views complaint records and status tracking. Complaint flow follows: Submit -> Pending -> In Progress -> Resolved, enabling complete visibility of issue resolution.

## Figure 6 - Student Leave Requests

Image: [report_screenshots_perfect/06-student-leave-requests.png](report_screenshots_perfect/06-student-leave-requests.png)

Workflow Step:
The student tracks leave requests and approval status. Leave workflow follows: Apply with reason and date range -> Review by authority -> Approved/Rejected decision with status update.

## Figure 7 - Student Mess Menu

Image: [report_screenshots_perfect/07-student-mess-menu.png](report_screenshots_perfect/07-student-mess-menu.png)

Workflow Step:
The student checks daily/weekly meal plans and timings. This supports better planning and improves communication between mess management and hostel residents.

## Figure 8 - Feedback Submission

Image: [report_screenshots_perfect/08-student-feedback-submit.png](report_screenshots_perfect/08-student-feedback-submit.png)

Workflow Step:
The student submits meal feedback and ratings. The system stores responses for service quality analysis and helps management improve food operations.

## Figure 9 - Warden Dashboard

Image: [report_screenshots_perfect/09-warden-dashboard.png](report_screenshots_perfect/09-warden-dashboard.png)

Workflow Step:
The warden dashboard provides operational overview and moderation tools. Wardens monitor complaints, leave requests, and resident-level activities from one interface.

## Figure 10 - Warden Complaint Management

Image: [report_screenshots_perfect/10-warden-complaints-management.png](report_screenshots_perfect/10-warden-complaints-management.png)

Workflow Step:
Warden reviews student complaints, prioritizes by category/severity, and updates status with resolution notes. This is the core issue-handling control point for hostel administration.

## Figure 11 - Warden Leave Management

Image: [report_screenshots_perfect/11-warden-leave-management.png](report_screenshots_perfect/11-warden-leave-management.png)

Workflow Step:
Warden verifies leave details and takes approval decisions. Decision flow is recorded and reflected back to student dashboards for real-time transparency.

## Figure 12 - Warden Residents Management

Image: [report_screenshots_perfect/12-warden-residents-management.png](report_screenshots_perfect/12-warden-residents-management.png)

Workflow Step:
Warden manages resident directory, occupancy details, and student hostel records. This supports governance, accountability, and fast resident lookup.

## Figure 13 - Admin Analytics

Image: [report_screenshots_perfect/13-admin-analytics.png](report_screenshots_perfect/13-admin-analytics.png)

Workflow Step:
Admin views system-wide insights including usage trends, complaints performance, leave metrics, and operational KPIs. This provides data-driven decision support.

## Figure 14 - Settings

Image: [report_screenshots_perfect/14-settings-page.png](report_screenshots_perfect/14-settings-page.png)

Workflow Step:
Authorized users configure account/system preferences. Settings control helps maintain secure, personalized, and manageable platform behavior.

## Figure 15 - QR Attendance

Image: [report_screenshots_perfect/15-qr-attendance-page.png](report_screenshots_perfect/15-qr-attendance-page.png)

Workflow Step:
QR-based attendance flow captures mess participation efficiently. Scan-based check-in reduces manual errors and provides structured meal attendance records.

## End-to-End Flow Summary

User Login -> Role-Based Dashboard -> Feature Module Access -> API Validation and Processing -> Data Update -> Status/Notification Reflection in UI.

This sequence demonstrates complete project flow control and working across Student, Warden, and Admin roles.
