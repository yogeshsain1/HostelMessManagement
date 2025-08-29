// Centralized realistic mock data for demo

export const analyticsData = {
  complaintTrends: [
    { month: "Jan", complaints: 48, resolved: 45 },
    { month: "Feb", complaints: 52, resolved: 50 },
    { month: "Mar", complaints: 39, resolved: 36 },
    { month: "Apr", complaints: 61, resolved: 59 },
    { month: "May", complaints: 47, resolved: 44 },
    { month: "Jun", complaints: 33, resolved: 31 },
  ],
  complaintCategories: [
    { name: "Maintenance", value: 46, color: "#8884d8" },
    { name: "Cleanliness", value: 28, color: "#82ca9d" },
    { name: "Food", value: 18, color: "#ffc658" },
    { name: "Other", value: 8, color: "#ff7300" },
  ],
  messAttendance: [
    { day: "Mon", breakfast: 85, lunch: 91, snacks: 78, dinner: 88 },
    { day: "Tue", breakfast: 88, lunch: 89, snacks: 82, dinner: 91 },
    { day: "Wed", breakfast: 82, lunch: 94, snacks: 75, dinner: 86 },
    { day: "Thu", breakfast: 90, lunch: 87, snacks: 80, dinner: 93 },
    { day: "Fri", breakfast: 87, lunch: 91, snacks: 85, dinner: 89 },
    { day: "Sat", breakfast: 77, lunch: 86, snacks: 72, dinner: 83 },
    { day: "Sun", breakfast: 79, lunch: 84, snacks: 73, dinner: 85 },
  ],
  satisfaction: [
    { month: "Jan", satisfaction: 78 },
    { month: "Feb", satisfaction: 82 },
    { month: "Mar", satisfaction: 85 },
    { month: "Apr", satisfaction: 79 },
    { month: "May", satisfaction: 88 },
    { month: "Jun", satisfaction: 91 },
  ],
  leaveRequests: [
    { month: "Jan", requests: 25, approved: 23 },
    { month: "Feb", requests: 32, approved: 28 },
    { month: "Mar", requests: 18, approved: 17 },
    { month: "Apr", requests: 41, approved: 38 },
    { month: "May", requests: 28, approved: 26 },
    { month: "Jun", requests: 35, approved: 33 },
  ],
}

export const activities = [
  {
    id: "a1",
    type: "complaint" as const,
    title: "Food quality feedback",
    description: "4-star rating given for today's lunch",
    timestamp: "5 minutes ago",
    status: "approved",
  },
  {
    id: "a2",
    type: "mess" as const,
    title: "QR Attendance",
    description: "387 students marked attendance for lunch",
    timestamp: "35 minutes ago",
    status: "in-progress",
  },
  {
    id: "a3",
    type: "leave" as const,
    title: "Leave Request Approved",
    description: "3-day leave approved for Rahul Kumar",
    timestamp: "1 hour ago",
    status: "approved",
  },
  {
    id: "a4",
    type: "notification" as const,
    title: "Kitchen maintenance",
    description: "Scheduled maintenance on Friday 5-7 PM",
    timestamp: "3 hours ago",
  },
]



