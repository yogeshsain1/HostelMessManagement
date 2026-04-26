-- Create enums
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'WARDEN', 'ADMIN');
CREATE TYPE "ComplaintStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'RESOLVED');
CREATE TYPE "ComplaintPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TYPE "LeaveType" AS ENUM ('PERSONAL', 'MEDICAL', 'ACADEMIC', 'EMERGENCY');
CREATE TYPE "LeaveStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- Create core user table
CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "phone" TEXT,
  "role" "UserRole" NOT NULL DEFAULT 'STUDENT',
  "hostelId" TEXT,
  "roomNumber" TEXT,
  "addressLine1" TEXT,
  "addressLine2" TEXT,
  "city" TEXT,
  "state" TEXT,
  "postalCode" TEXT,
  "emergencyContactName" TEXT,
  "emergencyContactPhone" TEXT,
  "course" TEXT,
  "year" TEXT,
  "profileImageUrl" TEXT,
  "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Create complaints table
CREATE TABLE "Complaint" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "status" "ComplaintStatus" NOT NULL DEFAULT 'PENDING',
  "priority" "ComplaintPriority" NOT NULL DEFAULT 'MEDIUM',
  "assignedTo" TEXT,
  "resolutionNote" TEXT,
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "resolvedAt" TIMESTAMP(3),

  CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Complaint_userId_idx" ON "Complaint"("userId");
CREATE INDEX "Complaint_status_idx" ON "Complaint"("status");

ALTER TABLE "Complaint"
ADD CONSTRAINT "Complaint_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create leave requests table
CREATE TABLE "LeaveRequest" (
  "id" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "type" "LeaveType" NOT NULL DEFAULT 'PERSONAL',
  "startDate" TIMESTAMP(3) NOT NULL,
  "endDate" TIMESTAMP(3) NOT NULL,
  "status" "LeaveStatus" NOT NULL DEFAULT 'PENDING',
  "destination" TEXT,
  "rejectionReason" TEXT,
  "approvedBy" TEXT,
  "approvedAt" TIMESTAMP(3),
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "LeaveRequest_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "LeaveRequest_userId_idx" ON "LeaveRequest"("userId");
CREATE INDEX "LeaveRequest_status_idx" ON "LeaveRequest"("status");

ALTER TABLE "LeaveRequest"
ADD CONSTRAINT "LeaveRequest_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
