import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

// College Configuration
const COLLEGE_CONFIG = {
  name: 'Poornima University',
  location: 'Jaipur, Rajasthan',
  hostels: [
    { name: 'Engineering Hostel A', capacity: 200, type: 'Boys', wardenName: 'Dr. Rajesh Verma' },
    { name: 'Engineering Hostel B', capacity: 180, type: 'Boys', wardenName: 'Prof. Sunita Sharma' },
    { name: 'Science Hostel', capacity: 150, type: 'Girls', wardenName: 'Dr. Meera Iyer' },
    { name: 'Management Hostel', capacity: 120, type: 'Mixed', wardenName: 'Mr. Vikram Singh' },
    { name: 'Medical Hostel', capacity: 100, type: 'Mixed', wardenName: 'Dr. Anjali Gupta' }
  ],
  branches: [
    'Computer Science', 'Information Technology', 'Mechanical Engineering',
    'Electrical Engineering', 'Civil Engineering', 'Chemical Engineering',
    'Biotechnology', 'Physics', 'Chemistry', 'Mathematics',
    'Business Administration', 'Commerce', 'Economics', 'Psychology',
    'Medicine', 'Nursing', 'Pharmacy', 'Dentistry'
  ]
}

// Realistic Complaint Types
const COMPLAINT_TYPES = [
  { category: 'maintenance', title: 'WiFi Connectivity Issues', description: 'Internet connection is very slow in room' },
  { category: 'maintenance', title: 'Electrical Fault', description: 'Power outlet not working in study area' },
  { category: 'maintenance', title: 'Plumbing Problem', description: 'Water leakage from bathroom faucet' },
  { category: 'maintenance', title: 'AC Not Working', description: 'Air conditioner making strange noise and not cooling properly' },
  { category: 'cleanliness', title: 'Room Cleaning Delay', description: 'Room cleaning service not done for 3 days' },
  { category: 'cleanliness', title: 'Common Area Messy', description: 'Common lounge area not cleaned properly' },
  { category: 'cleanliness', title: 'Bathroom Hygiene', description: 'Bathroom tiles need scrubbing and cleaning' },
  { category: 'food', title: 'Mess Food Quality', description: 'Today\'s lunch had foreign particles' },
  { category: 'food', title: 'Mess Timing Issues', description: 'Dinner served 30 minutes late' },
  { category: 'food', title: 'Food Quantity Insufficient', description: 'Portion sizes are too small for students' },
  { category: 'security', title: 'Security Concern', description: 'Suspicious person seen near hostel entrance' },
  { category: 'security', title: 'Gate Access Problem', description: 'Main gate not closing properly at night' },
  { category: 'other', title: 'Noise Complaint', description: 'Excessive noise from neighboring room after 11 PM' },
  { category: 'other', title: 'Parking Issue', description: 'No parking space available for visitors' },
  { category: 'other', title: 'Laundry Service', description: 'Laundry service not picking up clothes on time' }
]

// Leave Request Reasons
const LEAVE_REASONS = [
  'Medical Emergency - Family member hospitalized',
  'Family Function - Attending cousin\'s wedding',
  'Exam Preparation - Need to study at home',
  'Sports Competition - Inter-college tournament',
  'Personal Reasons - Family matters',
  'Religious Festival - Celebrating festival at home',
  'Internship Interview - Attending job interview',
  'Conference/Workshop - Technical conference participation',
  'Medical Checkup - Routine health checkup',
  'Home Visit - Parents requested visit',
  'Project Work - Group project meeting',
  'Competition - Participating in coding competition'
]

// Mess Menu Data
const MESS_MENU = {
  weekly: {
    monday: {
      breakfast: ['Aloo Paratha', 'Dahi', 'Tea/Coffee', 'Seasonal Fruit'],
      lunch: ['Rajma Chawal', 'Boondi Raita', 'Salad', 'Pickle'],
      snacks: ['Samosa', 'Green Tea'],
      dinner: ['Paneer Butter Masala', 'Butter Naan', 'Jeera Rice', 'Mixed Salad']
    },
    tuesday: {
      breakfast: ['Poha', 'Jalebi', 'Tea/Coffee', 'Banana'],
      lunch: ['Chole Bhature', 'Onion Salad', 'Raita', 'Chutney'],
      dinner: ['Chicken Curry', 'Rice', 'Dal Tadka', 'Cucumber Salad']
    },
    wednesday: {
      breakfast: ['Idli Sambhar', 'Coconut Chutney', 'Tea/Coffee', 'Apple'],
      lunch: ['Dal Makhani', 'Rice', 'Mixed Vegetables', 'Salad'],
      dinner: ['Fish Curry', 'Rice', 'Dal', 'Onion Salad']
    },
    thursday: {
      breakfast: ['Upma', 'Banana', 'Tea/Coffee', 'Orange'],
      lunch: ['Paneer Tikka Masala', 'Naan', 'Rice', 'Raita'],
      dinner: ['Mutton Curry', 'Rice', 'Dal', 'Cucumber Raita']
    },
    friday: {
      breakfast: ['Dosa', 'Sambhar', 'Chutney', 'Tea/Coffee'],
      lunch: ['Chicken Biryani', 'Raita', 'Salad', 'Pickle'],
      dinner: ['Vegetable Pulao', 'Dal', 'Chicken Masala', 'Salad']
    },
    saturday: {
      breakfast: ['Paratha', 'Curd', 'Tea/Coffee', 'Papaya'],
      lunch: ['Fish Biryani', 'Raita', 'Salad', 'Chutney'],
      dinner: ['Paneer Biryani', 'Dal', 'Mixed Vegetables', 'Raita']
    },
    sunday: {
      breakfast: ['Puri Bhaji', 'Tea/Coffee', 'Sweet Dish', 'Fruit'],
      lunch: ['Special Thali', 'Rice', 'Dal', 'Vegetables', 'Salad'],
      dinner: ['Biryani Special', 'Raita', 'Salad', 'Pickle']
    }
  },
  special_events: [
    { date: '2024-01-15', event: 'Republic Day', special_menu: 'Tricolor Theme Menu' },
    { date: '2024-01-26', event: 'College Foundation Day', special_menu: 'Celebration Menu' },
    { date: '2024-02-14', event: 'Valentine\'s Week', special_menu: 'Romantic Dinner' },
    { date: '2024-03-08', event: 'Women\'s Day', special_menu: 'Special Ladies Menu' },
    { date: '2024-03-25', event: 'Holi Celebration', special_menu: 'Festival Special' }
  ]
}

// Event Types for Calendar
const EVENT_TYPES = [
  { type: 'academic', title: 'Guest Lecture: AI in Healthcare', location: 'Auditorium' },
  { type: 'sports', title: 'Inter-Hostel Cricket Tournament', location: 'Sports Ground' },
  { type: 'cultural', title: 'Annual Cultural Fest', location: 'Main Campus' },
  { type: 'maintenance', title: 'Hostel Maintenance Shutdown', location: 'All Hostels' },
  { type: 'meeting', title: 'Hostel Committee Meeting', location: 'Conference Room' },
  { type: 'academic', title: 'Workshop: Career Guidance', location: 'Seminar Hall' },
  { type: 'sports', title: 'Basketball Championship', location: 'Sports Complex' },
  { type: 'cultural', title: 'Music Competition', location: 'Open Air Theatre' },
  { type: 'emergency', title: 'Fire Safety Drill', location: 'All Buildings' },
  { type: 'meeting', title: 'Parent-Teacher Meeting', location: 'Lecture Halls' }
]

async function createCollegeDemoData() {
  console.log('🚀 Starting College Demo Data Creation...')

  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...')
    await prisma.notification.deleteMany()
    await prisma.messFeedback.deleteMany()
    await prisma.messAttendance.deleteMany()
    await prisma.leaveRequest.deleteMany()
    await prisma.complaint.deleteMany()
    await prisma.event.deleteMany()
    await prisma.userPreference.deleteMany()
    await prisma.user.deleteMany()
    await prisma.hostel.deleteMany()
    await prisma.messMenu.deleteMany()

    // Create Hostels
    console.log('🏢 Creating hostels...')
    const hostels = []
    for (const hostelData of COLLEGE_CONFIG.hostels) {
      const warden = await prisma.user.create({
        data: {
          email: `${hostelData.wardenName.toLowerCase().replace(/\s+/g, '.')}@college.edu`,
          passwordHash: await bcrypt.hash('password123', 10),
          fullName: hostelData.wardenName,
          phone: faker.phone.number(),
          role: 'warden'
        }
      })

      const hostel = await prisma.hostel.create({
        data: {
          name: hostelData.name,
          wardenId: warden.id,
          totalRooms: hostelData.capacity
        }
      })

      // Update warden with hostel assignment
      await prisma.user.update({
        where: { id: warden.id },
        data: { hostelId: hostel.id }
      })

      hostels.push({ ...hostel, warden, type: hostelData.type })
    }

    // Create Admin User
    console.log('👑 Creating admin user...')
    const admin = await prisma.user.create({
      data: {
        email: 'admin@poornima.edu',
        passwordHash: await bcrypt.hash('admin123', 10),
        fullName: 'Dr. Rakesh Sharma',
        phone: '+91-9876543210',
        role: 'admin'
      }
    })

    // Create Students (500+)
    console.log('🎓 Creating 500+ students...')
    const students = []
    const totalStudents = 550

    for (let i = 0; i < totalStudents; i++) {
      const branch = faker.helpers.arrayElement(COLLEGE_CONFIG.branches)
      const year = faker.helpers.arrayElement([1, 2, 3, 4])
      const hostel = faker.helpers.arrayElement(hostels)

      // Skip if hostel is full (rough estimation)
      const existingStudents = students.filter(s => s.hostelId === hostel.id).length
      if (existingStudents >= hostel.totalRooms * 2) continue // Assuming 2 students per room

      const student = await prisma.user.create({
        data: {
          email: `student${i + 1}@poornima.edu`,
          passwordHash: await bcrypt.hash('password123', 10),
          fullName: faker.person.fullName(),
          phone: faker.phone.number(),
          role: 'student',
          hostelId: hostel.id,
          roomNumber: `${faker.helpers.arrayElement(['A', 'B', 'C'])}${faker.number.int({ min: 101, max: 999 })}`
        }
      })

      students.push(student)
    }

    console.log(`✅ Created ${students.length} students`)

    // Create Mess Menu for a Month
    console.log('🍽️ Creating monthly mess menu...')
    const startDate = new Date('2024-01-01')
    const endDate = new Date('2024-01-31')

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
      const menuData = MESS_MENU.weekly[dayOfWeek]

      // Check for special events
      const specialEvent = MESS_MENU.special_events.find(event =>
        event.date === date.toISOString().split('T')[0]
      )

      const meals = ['breakfast', 'lunch', 'dinner']
      for (const mealType of meals) {
        let items = menuData[mealType]

        if (specialEvent && mealType === 'dinner') {
          items = [`🎉 ${specialEvent.special_menu}`, ...items.slice(1)]
        }

        await prisma.messMenu.create({
          data: {
            date: new Date(date),
            mealType: mealType,
            items: JSON.stringify(items)
          }
        })
      }
    }

    // Create Complaints (50+)
    console.log('📝 Creating realistic complaints...')
    const complaints = []
    for (let i = 0; i < 75; i++) {
      const student = faker.helpers.arrayElement(students)
      const complaintType = faker.helpers.arrayElement(COMPLAINT_TYPES)
      const daysAgo = faker.number.int({ min: 1, max: 30 })
      const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)

      const statuses = ['pending', 'in-progress', 'resolved', 'rejected']
      const priorities = ['low', 'medium', 'high', 'urgent']
      const weights = [0.3, 0.4, 0.2, 0.1] // More medium/low complaints

      const complaint = await prisma.complaint.create({
        data: {
          userId: student.id,
          hostelId: student.hostelId,
          title: complaintType.title,
          description: complaintType.description,
          category: complaintType.category,
          status: faker.helpers.weightedArrayElement([
            { weight: 0.3, value: 'pending' },
            { weight: 0.4, value: 'inProgress' },
            { weight: 0.2, value: 'resolved' },
            { weight: 0.1, value: 'rejected' }
          ]),
          priority: faker.helpers.weightedArrayElement([
            { weight: 0.4, value: 'low' },
            { weight: 0.4, value: 'medium' },
            { weight: 0.15, value: 'high' },
            { weight: 0.05, value: 'urgent' }
          ]),
          createdAt
        }
      })

      complaints.push(complaint)
    }

    // Create Leave Requests (100+)
    console.log('📋 Creating leave requests...')
    for (let i = 0; i < 120; i++) {
      const student = faker.helpers.arrayElement(students)
      const reason = faker.helpers.arrayElement(LEAVE_REASONS)
      const daysAgo = faker.number.int({ min: 1, max: 45 })
      const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)

      const leaveDays = faker.number.int({ min: 1, max: 7 })
      const startDate = new Date(createdAt)
      startDate.setDate(startDate.getDate() + faker.number.int({ min: 1, max: 14 }))

      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + leaveDays)

      await prisma.leaveRequest.create({
        data: {
          userId: student.id,
          startDate,
          endDate,
          reason,
          status: faker.helpers.weightedArrayElement([
            { weight: 0.4, value: 'pending' },
            { weight: 0.4, value: 'approved' },
            { weight: 0.15, value: 'rejected' }
          ]),
          createdAt
        }
      })
    }

    // Create Events
    console.log('📅 Creating events...')
    for (let i = 0; i < 25; i++) {
      const eventType = faker.helpers.arrayElement(EVENT_TYPES)
      const daysFromNow = faker.number.int({ min: -15, max: 30 })
      const eventDate = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000)

      const duration = faker.number.int({ min: 1, max: 8 }) // 1-8 hours
      const endDate = new Date(eventDate)
      endDate.setHours(endDate.getHours() + duration)

      await prisma.event.create({
        data: {
          title: eventType.title,
          description: faker.lorem.sentences(2),
          startDate: eventDate,
          endDate,
          location: eventType.location,
          type: eventType.type,
          createdBy: faker.helpers.arrayElement([admin.id, ...hostels.map(h => h.warden.id)])
        }
      })
    }

    // Create Mess Attendance Records (Realistic Patterns)
    console.log('🍽️ Creating mess attendance records...')
    const recentDays = 14 // Last 2 weeks
    for (let day = 0; day < recentDays; day++) {
      const date = new Date(Date.now() - day * 24 * 60 * 60 * 1000)
      const meals = ['breakfast', 'lunch', 'dinner']

      for (const meal of meals) {
        // 70-90% attendance rate (realistic)
        const attendanceRate = faker.number.float({ min: 0.7, max: 0.9 })
        const attendingStudents = faker.helpers.arrayElements(
          students,
          Math.floor(students.length * attendanceRate)
        )

        for (const student of attendingStudents) {
          await prisma.messAttendance.create({
            data: {
              userId: student.id,
              date,
              mealType: meal,
              checkedInAt: new Date(date.getTime() + faker.number.int({ min: 0, max: 7200000 })) // Within 2 hours
            }
          })
        }
      }
    }

    // Create Mess Feedback
    console.log('⭐ Creating mess feedback...')
    for (let i = 0; i < 200; i++) {
      const student = faker.helpers.arrayElement(students)
      const daysAgo = faker.number.int({ min: 1, max: 14 })
      const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
      const mealType = faker.helpers.arrayElement(['breakfast', 'lunch', 'dinner'])

      await prisma.messFeedback.create({
        data: {
          userId: student.id,
          date,
          mealType: mealType,
          rating: faker.number.int({ min: 1, max: 5 }),
          comment: faker.helpers.maybe(() => faker.lorem.sentences(1), { probability: 0.6 })
        }
      })
    }

    // Create Notifications
    console.log('🔔 Creating notifications...')
    const notificationTemplates = [
      { type: 'complaint', title: 'Complaint Update', message: 'Your complaint status has been updated' },
      { type: 'leave', title: 'Leave Request Update', message: 'Your leave request has been reviewed' },
      { type: 'mess', title: 'Menu Update', message: 'Tomorrow\'s menu has been updated' },
      { type: 'event', title: 'New Event', message: 'A new event has been scheduled' },
      { type: 'announcement', title: 'Important Announcement', message: 'Please check the latest updates' }
    ]

    for (let i = 0; i < 150; i++) {
      const template = faker.helpers.arrayElement(notificationTemplates)
      const recipient = faker.helpers.maybe(() => faker.helpers.arrayElement(students).id, { probability: 0.7 })
      const hostel = faker.helpers.maybe(() => faker.helpers.arrayElement(hostels).id, { probability: 0.3 })

      await prisma.notification.create({
        data: {
          userId: recipient,
          hostelId: hostel,
          title: template.title,
          message: template.message,
          type: template.type,
          read: faker.datatype.boolean(0.6), // 60% read
          createdAt: new Date(Date.now() - faker.number.int({ min: 0, max: 30 }) * 24 * 60 * 60 * 1000)
        }
      })
    }

    // Create User Preferences
    console.log('⚙️ Creating user preferences...')
    for (const student of students.slice(0, 100)) { // First 100 students
      await prisma.userPreference.create({
        data: {
          userId: student.id,
          theme: faker.helpers.arrayElement(['light', 'dark', 'system']),
          language: faker.helpers.arrayElement(['en', 'hi']),
          timezone: 'Asia/Kolkata',
          notifications: JSON.stringify({
            email: faker.datatype.boolean(),
            push: faker.datatype.boolean(),
            complaints: faker.datatype.boolean(),
            events: faker.datatype.boolean(),
            maintenance: faker.datatype.boolean(),
            leave: faker.datatype.boolean()
          }),
          dashboardLayout: JSON.stringify({
            showStats: faker.datatype.boolean(),
            showRecentActivity: faker.datatype.boolean(),
            showQuickActions: faker.datatype.boolean(),
            compactMode: faker.datatype.boolean()
          })
        }
      })
    }

    console.log('🎉 College Demo Data Creation Complete!')
    console.log(`
📊 Summary:
🏢 Hostels: ${hostels.length}
👨‍🎓 Students: ${students.length}
📝 Complaints: ${complaints.length}
📋 Leave Requests: 120+
🍽️ Mess Menu: 31 days × 4 meals
📅 Events: 25+
🍽️ Attendance Records: ~${Math.floor(students.length * 0.8 * recentDays * 3)}
⭐ Feedback Records: 200+
🔔 Notifications: 150+
⚙️ User Preferences: 100+

Your hostel management system now contains realistic college data! 🚀
    `)

  } catch (error) {
    console.error('❌ Error creating demo data:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seed script
createCollegeDemoData()
  .catch((e) => {
    console.error('❌ Seed script failed:', e)
    process.exit(1)
  })
