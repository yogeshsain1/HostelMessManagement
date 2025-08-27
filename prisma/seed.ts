import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create hostels
  const sunriseHostel = await prisma.hostel.create({
    data: {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Sunrise Hostel',
      totalRooms: 100,
    },
  })

  const moonlightHostel = await prisma.hostel.create({
    data: {
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: 'Moonlight Hostel',
      totalRooms: 80,
    },
  })

  const greenValleyHostel = await prisma.hostel.create({
    data: {
      id: '550e8400-e29b-41d4-a716-446655440003',
      name: 'Green Valley Hostel',
      totalRooms: 120,
    },
  })

  console.log('✅ Created hostels')

  // Hash password for all users
  const hashedPassword = await bcrypt.hash('password123', 10)

  // Create users
  const admin = await prisma.user.create({
    data: {
      id: '550e8400-e29b-41d4-a716-446655440010',
      email: 'admin@hostel.com',
      passwordHash: hashedPassword,
      fullName: 'Admin User',
      phone: '+1234567890',
      role: 'admin',
    },
  })

  const warden = await prisma.user.create({
    data: {
      id: '550e8400-e29b-41d4-a716-446655440011',
      email: 'warden1@hostel.com',
      passwordHash: hashedPassword,
      fullName: 'John Warden',
      phone: '+1234567891',
      role: 'warden',
      hostelId: sunriseHostel.id,
    },
  })

  const student1 = await prisma.user.create({
    data: {
      id: '550e8400-e29b-41d4-a716-446655440012',
      email: 'student1@hostel.com',
      passwordHash: hashedPassword,
      fullName: 'Alice Student',
      phone: '+1234567892',
      role: 'student',
      hostelId: sunriseHostel.id,
      roomNumber: 'A101',
    },
  })

  const student2 = await prisma.user.create({
    data: {
      id: '550e8400-e29b-41d4-a716-446655440013',
      email: 'student2@hostel.com',
      passwordHash: hashedPassword,
      fullName: 'Bob Student',
      phone: '+1234567893',
      role: 'student',
      hostelId: sunriseHostel.id,
      roomNumber: 'A102',
    },
  })

  console.log('✅ Created users')

  // Update hostel with warden
  await prisma.hostel.update({
    where: { id: sunriseHostel.id },
    data: { wardenId: warden.id },
  })

  // Create mess menu for today and tomorrow
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const menuItems = {
    breakfast: ['Idli', 'Sambar', 'Coconut Chutney', 'Tea/Coffee'],
    lunch: ['Rice', 'Dal', 'Vegetable Curry', 'Pickle', 'Curd'],
    dinner: ['Roti', 'Paneer Curry', 'Rice', 'Dal', 'Salad'],
  }

  for (const date of [today, tomorrow]) {
    for (const [mealType, items] of Object.entries(menuItems)) {
      await prisma.messMenu.create({
        data: {
          date,
          mealType: mealType as 'breakfast' | 'lunch' | 'dinner',
          items: JSON.stringify(items),
        },
      })
    }
  }

  console.log('✅ Created mess menu')

  // Create sample complaints
  await prisma.complaint.create({
    data: {
      userId: student1.id,
      hostelId: sunriseHostel.id,
      title: 'Broken AC in Room A101',
      description: 'The air conditioner in my room is not working properly',
      category: 'maintenance',
      status: 'pending',
      priority: 'high',
    },
  })

  await prisma.complaint.create({
    data: {
      userId: student2.id,
      hostelId: sunriseHostel.id,
      title: 'Bathroom Cleaning Issue',
      description: 'Common bathroom on 1st floor needs cleaning',
      category: 'cleanliness',
      status: 'inProgress',
      priority: 'medium',
    },
  })

  console.log('✅ Created sample complaints')

  // Create sample leave request
  const nextWeek = new Date(today)
  nextWeek.setDate(nextWeek.getDate() + 7)
  const weekAfter = new Date(nextWeek)
  weekAfter.setDate(weekAfter.getDate() + 3)

  await prisma.leaveRequest.create({
    data: {
      userId: student1.id,
      startDate: nextWeek,
      endDate: weekAfter,
      reason: 'Family vacation',
      status: 'pending',
    },
  })

  console.log('✅ Created sample leave request')

  // Create sample notifications
  /*
  await prisma.notification.create({
    data: {
      userId: undefined, // Broadcast notification
      title: 'Welcome to Hostel Management System',
      message: 'Welcome! This is your new hostel management platform.',
      type: 'info',
    },
  })

  await prisma.notification.create({
    data: {
      userId: student1.id,
      title: 'Room Maintenance Scheduled',
      message: 'Maintenance work will be done in your room tomorrow between 10 AM - 12 PM.',
      type: 'warning',
    },
  })

  console.log('✅ Created sample notifications')
  */

  console.log('🎉 Database seeding completed successfully!')
  console.log('')
  console.log('📋 Test Accounts:')
  console.log('Admin: admin@hostel.com / password123')
  console.log('Warden: warden1@hostel.com / password123')
  console.log('Student 1: student1@hostel.com / password123')
  console.log('Student 2: student2@hostel.com / password123')
  console.log('')
  console.log('🌐 Your app is running at: http://localhost:3001')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
