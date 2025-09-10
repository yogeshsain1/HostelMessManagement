const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: 'admin@hostel.com',
        fullName: 'Admin User',
        password: hashedPassword,
        role: 'ADMIN',
        hostel: null,
        room: null,
        phone: '+91 9876543210',
      },
    });
    
    console.log('Admin user created successfully:', admin);
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('Admin user already exists');
    } else {
      console.error('Error creating admin user:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
