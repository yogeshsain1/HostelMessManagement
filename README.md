# Hostel Mess Management System

A modern, responsive web application for managing hostel mess operations, student complaints, leave requests, and administrative tasks at Poornima University.

## ✨ Features

### 🎯 **Student Dashboard**
- **Modern UI/UX**: Clean, mobile-friendly interface with intuitive navigation
- **Welcome Message**: Personalized greeting with student's name
- **Overview Cards**: Quick stats for pending leave requests, mess attendance, active complaints
- **Quick Actions**: Easy access to common tasks (submit complaint, request leave, view menu)
- **Today's Menu**: Highlighted daily meal information with ratings
- **Recent Activity**: Track complaints and leave request statuses

### 🏠 **Enhanced Student Sections**

#### **Profile Management**
- Editable phone and email fields
- Student information display (ID, hostel, room)
- Account security settings
- Recent activity timeline

#### **Hostel Information**
- Comprehensive hostel details and facilities
- Warden contact information
- Hostel rules and regulations
- Emergency contact numbers
- Room occupancy statistics

#### **Mess Management**
- Weekly menu in calendar style
- Today's meals highlighted
- Meal ratings and timing
- Quick attendance marking
- Feedback submission

#### **Complaints System**
- Submit new complaints with categories
- Track complaint status (Pending/In Progress/Resolved)
- Filter by status
- Detailed complaint information
- Quick actions for each complaint

#### **Leave Requests**
- Apply for different types of leave (Personal, Medical, Academic)
- Track request status (Pending/Approved/Rejected)
- Filter by status
- Detailed leave information with reasons
- Approval/rejection tracking

### 🔐 **Authentication & Security**
- Role-based access control (Student, Warden, Admin)
- Secure login with demo accounts
- Session management
- Protected routes

### 📱 **Responsive Design**
- Mobile-first approach
- Touch-friendly interface
- Adaptive layouts for all screen sizes
- Modern card-based design

### 🎨 **UI Components**
- Shadcn/ui component library
- Custom theme support
- Smooth animations and transitions
- Consistent design language

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HostelMessManagement
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 👥 Demo Accounts

### Student Login
- **Email**: `student1@poornima.edu.in`
- **Password**: `password123`
- **Features**: View mess menu, submit complaints, request leave, view hostel info

### Warden Login
- **Email**: `warden1@poornima.edu.in`
- **Password**: `password123`
- **Features**: Manage complaints, approve leave requests, view reports

### Admin Login
- **Email**: `admin@poornima.edu.in`
- **Password**: `password123`
- **Features**: Full system access, user management, analytics

## 🎮 Demo Features

### **Keyboard Shortcuts**
- `Ctrl + K`: Toggle sidebar
- `Shift + M`: Navigate to Mess page
- `Shift + A`: Navigate to Admin Analytics (admin only)

### **Demo Walkthrough**

#### **1. Student Experience**
1. Login as `student1@poornima.edu.in`
2. Explore the modern dashboard with welcome message
3. View today's mess menu and weekly schedule
4. Submit a complaint about WiFi connectivity
5. Apply for personal leave
6. Check hostel information and facilities
7. Update profile information

#### **2. Navigation Features**
- **Sidebar Navigation**: Clean, icon-based navigation
- **Quick Actions**: Easy access to common tasks
- **Status Tracking**: Real-time updates on requests
- **Filtering**: Sort complaints and leave requests by status

#### **3. Mobile Experience**
- Responsive design for all screen sizes
- Touch-friendly interface
- Optimized layouts for mobile devices

## 🏗️ Project Structure

```
HostelMessManagement/
├── app/                          # Next.js app directory
│   ├── dashboard/               # Dashboard pages
│   │   ├── admin/              # Admin-specific pages
│   │   ├── complaints/         # Complaint management
│   │   ├── hostel/             # Hostel information
│   │   ├── leave/              # Leave request management
│   │   ├── mess/               # Mess menu and management
│   │   └── profile/            # User profile management
│   ├── api/                    # API routes
│   ├── globals.css             # Global styles
│   └── layout.tsx              # Root layout
├── components/                  # Reusable components
│   ├── ui/                     # UI components (shadcn/ui)
│   ├── layout/                 # Layout components
│   ├── dashboard/              # Dashboard-specific components
│   └── mess/                   # Mess-related components
├── lib/                        # Utility libraries
│   ├── auth.tsx                # Authentication logic
│   ├── mock-data.ts            # Mock data for demo
│   └── utils.ts                # Utility functions
└── public/                     # Static assets
    └── images/                 # Images and logos
```

## 🎨 Design System

### **Color Palette**
- **Primary**: Blue (#2563eb)
- **Success**: Green (#16a34a)
- **Warning**: Yellow (#ca8a04)
- **Error**: Red (#dc2626)
- **Muted**: Gray (#6b7280)

### **Typography**
- **Font Family**: Geist Sans (modern, readable)
- **Headings**: Bold, clear hierarchy
- **Body Text**: Optimized for readability

### **Components**
- **Cards**: Clean, elevated design
- **Buttons**: Consistent styling with hover effects
- **Badges**: Status indicators with color coding
- **Forms**: User-friendly input fields

## 🔧 Customization

### **Adding New Features**
1. Create new page in `app/dashboard/`
2. Add navigation item in `components/layout/dashboard-layout.tsx`
3. Update mock data in `lib/mock-data.ts`
4. Style with Tailwind CSS classes

### **Theme Customization**
- Modify `tailwind.config.ts` for color schemes
- Update `components/ui/theme-provider.tsx` for theme switching
- Customize CSS variables in `app/globals.css`

## 📱 Mobile Optimization

### **Responsive Breakpoints**
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### **Touch Interactions**
- Minimum 44px touch targets
- Swipe gestures for mobile
- Optimized spacing for mobile devices

## 🚀 Performance Features

### **Optimizations**
- Image optimization with Next.js Image
- Lazy loading for components
- Efficient state management
- Minimal bundle size

### **Loading States**
- Skeleton loaders
- Progressive loading
- Smooth transitions

## 🧪 Testing

### **Demo Scenarios**
1. **Student Workflow**: Complete student lifecycle
2. **Complaint Management**: Submit and track complaints
3. **Leave Management**: Apply and monitor leave requests
4. **Mess Operations**: View menus and mark attendance

### **Cross-browser Testing**
- Chrome, Firefox, Safari, Edge
- Mobile browsers
- Responsive design validation

## 📚 Documentation

### **Component Usage**
- All components include TypeScript interfaces
- Props documentation in component files
- Example usage in page components

### **API Integration**
- Mock data structure documented
- Easy to replace with real APIs
- Consistent data format

## 🤝 Contributing

### **Development Guidelines**
1. Follow TypeScript best practices
2. Use Tailwind CSS for styling
3. Maintain component consistency
4. Add proper error handling
5. Include loading states

### **Code Quality**
- ESLint configuration
- Prettier formatting
- Type safety with TypeScript
- Component reusability

## 📄 License

This project is developed for Poornima University as a demonstration of modern web application development practices.

## 🆘 Support

For technical support or questions:
- Check the demo walkthrough
- Review component documentation
- Examine mock data structure
- Test with different user roles

---

**Built with Next.js, React, TypeScript, and Tailwind CSS**
**Designed for modern web experiences and mobile-first development**