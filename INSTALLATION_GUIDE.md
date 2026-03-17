# 🚀 Installation & Setup Guide

## For Project Evaluators & External Users

This guide provides step-by-step instructions to install and run the Hostel Mess Management System on any machine.

---

## 📋 **Prerequisites**

Before you begin, ensure you have the following installed on your system:

### **Required Software:**
1. **Node.js** (v18.0.0 or higher)
   - Download: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Git** (optional, for cloning)
   - Download: https://git-scm.com/
   - Verify installation: `git --version`

### **System Requirements:**
- **OS:** Windows 10/11, macOS, or Linux
- **RAM:** Minimum 4GB (8GB recommended)
- **Storage:** 500MB free space
- **Browser:** Chrome, Firefox, Safari, or Edge (latest versions)

---

## 📥 **Installation Steps**

### **Option 1: Using Provided ZIP File**

1. **Extract the Project**
   ```bash
   # Extract the ZIP file to your desired location
   # Example: C:\Projects\HostelMessManagement
   ```

2. **Open Terminal/Command Prompt**
   - **Windows:** Press `Win + R`, type `cmd`, press Enter
   - **macOS/Linux:** Open Terminal application

3. **Navigate to Project Directory**
   ```bash
   cd path/to/HostelMessManagement
   # Example: cd C:\Projects\HostelMessManagement
   ```

4. **Install Dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```
   ⏱️ This will take 2-5 minutes depending on your internet speed

5. **Start the Application**
   ```bash
   npm run dev
   ```
   ✅ Wait for "Ready" message (usually 10-20 seconds)

6. **Open in Browser**
   - Open your web browser
   - Navigate to: **http://localhost:3000**
   - You should see the login page

---

### **Option 2: Using Git Clone (If Repository is Shared)**

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project folder
cd HostelMessManagement

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Open browser at http://localhost:3000
```

---

## 🎯 **Quick Start Guide**

### **Step 1: Access the Application**
After running `npm run dev`, open: **http://localhost:3000**

### **Step 2: Login**
Use one of these demo accounts:

#### **Student Account**
- **Email:** `student1@poornima.edu.in`
- **Password:** `password123`

#### **Warden Account**
- **Email:** `warden1@poornima.edu.in`
- **Password:** `password123`

#### **Admin Account**
- **Email:** `admin@poornima.edu.in`
- **Password:** `password123`

### **Step 3: Explore Features**
- Click the demo account buttons on login page for auto-fill
- Navigate through different modules using the sidebar
- Test student, warden, and admin functionalities

---

## 🔧 **Troubleshooting**

### **Problem: "Port 3000 is already in use"**
**Solution:**
```bash
# Kill the process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Or use a different port:
npm run dev -- -p 3001
# Then open http://localhost:3001
```

### **Problem: npm install fails**
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Try installing again
npm install --legacy-peer-deps

# If still fails, delete node_modules and try again:
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### **Problem: "Cannot find module" errors**
**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules .next
npm install --legacy-peer-deps
npm run dev
```

### **Problem: Page shows blank or won't load**
**Solution:**
- Clear browser cache (Ctrl + Shift + Delete)
- Try incognito/private mode
- Check browser console for errors (F12 → Console tab)
- Restart the dev server

### **Problem: Login doesn't work**
**Solution:**
- Make sure you're using exact credentials (case-sensitive)
- Clear browser localStorage:
  - Press F12 → Application → Local Storage → Clear
- Use the demo account buttons on login page (auto-fills credentials)
- Refresh the page

---

## 📱 **Testing on Mobile**

### **Option 1: Same Network**
1. Find your computer's IP address:
   ```bash
   # Windows:
   ipconfig
   # Look for IPv4 Address (e.g., 192.168.1.5)

   # macOS/Linux:
   ifconfig
   # Look for inet address
   ```

2. On your mobile device (connected to same WiFi):
   - Open browser
   - Navigate to: `http://YOUR_IP_ADDRESS:3000`
   - Example: `http://192.168.1.5:3000`

### **Option 2: Browser Dev Tools**
1. In Chrome/Edge:
   - Press F12
   - Click "Toggle device toolbar" (phone icon)
   - Select different device sizes
   - Test responsive design

---

## 🎨 **Features to Test**

### **Student Features:**
✅ View personalized dashboard  
✅ Check today's mess menu  
✅ Submit complaints  
✅ Apply for leave  
✅ View hostel information  
✅ Edit profile  

### **Warden Features:**
✅ View all complaints  
✅ Approve/reject leave requests  
✅ Manage residents  
✅ Update mess menu  
✅ View reports  

### **Admin Features:**
✅ System analytics  
✅ User management  
✅ Full system access  

---

## 🛠️ **Advanced Configuration**

### **Changing Port**
Edit `package.json`:
```json
{
  "scripts": {
    "dev": "next dev -p 3001"
  }
}
```

### **Environment Variables (Optional)**
Create `.env.local` file:
```env
NEXT_PUBLIC_APP_NAME="Hostel Management"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

---

## 📊 **Build for Production (Optional)**

To create an optimized production build:

```bash
# Build the application
npm run build

# Start production server
npm run start
```

The production build will be faster and more optimized.

---

## 🔍 **Verification Checklist**

After installation, verify these work:

- [ ] Application opens at http://localhost:3000
- [ ] Login page displays properly
- [ ] Demo account buttons auto-fill credentials
- [ ] Login with student account works
- [ ] Dashboard loads with student information
- [ ] Navigation sidebar works
- [ ] All pages load without errors
- [ ] Responsive design works (resize browser)
- [ ] Dark/light mode toggle works
- [ ] Logout functionality works

---

## 📞 **Support**

If you encounter issues during installation:

1. **Check Terminal Output:** Look for error messages
2. **Check Browser Console:** Press F12 → Console tab
3. **Verify Node Version:** Must be 18.0.0 or higher
4. **Clear Everything and Retry:**
   ```bash
   rm -rf node_modules .next package-lock.json
   npm install --legacy-peer-deps
   npm run dev
   ```

---

## ⏱️ **Installation Time Estimate**

- **Extracting files:** 1 minute
- **Installing dependencies:** 3-5 minutes
- **Starting server:** 20 seconds
- **Total:** ~5-7 minutes

---

## ✅ **Success Indicators**

You'll know the installation was successful when:

1. Terminal shows:
   ```
   ✓ Ready in 2.1s
   - Local: http://localhost:3000
   ```

2. Browser displays the professional login page with:
   - Poornima University logo
   - Three demo account buttons
   - Email and password fields

3. You can login and see the dashboard

---

## 🎓 **For Project Evaluators**

This is a **fully functional demo application** with:
- ✅ Working authentication
- ✅ Role-based dashboards
- ✅ Complete UI/UX implementation
- ✅ Responsive design
- ✅ Modern tech stack (Next.js 15, React 19, TypeScript)

**Note:** This is a demo project using mock data (localStorage). For production use, database integration would be required.

---

**Last Updated:** February 4, 2026  
**Project Version:** 1.0  
**Node.js Version Required:** 18.0.0+
