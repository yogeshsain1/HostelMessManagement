const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('Creating admin user...');
    
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@hostel.com',
        password: hashedPassword,
        name: 'Administrator',
        role: 'admin',
        roomNumber: 'ADMIN-001',
        hostelId: 'admin-hostel',
      },
    });

    console.log('Admin user created successfully:', {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    console.log('\nYou can now login with:');
    console.log('Email: admin@hostel.com');
    console.log('Password: password123');

  } catch (error) {
    if (error.code === 'P2002') {
      console.log('Admin user already exists with email: admin@hostel.com');
    } else {
      console.error('Error creating admin user:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
