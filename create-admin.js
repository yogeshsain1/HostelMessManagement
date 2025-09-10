const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  const prisma = new PrismaClient();

  try {
    console.log('Creating admin user...');

    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 12);

    // Check if admin user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'admin@hostel.com' }
    });

    if (existingUser) {
      console.log('Admin user exists, updating password...');
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { password: hashedPassword }
      });
      console.log('Password updated!');
    } else {
      const user = await prisma.user.create({
        data: {
          email: 'admin@hostel.com',
          password: hashedPassword,
          fullName: 'Admin User',
          role: 'ADMIN',
          phone: '+1234567890'
        }
      });
      console.log(`Created admin user: ${user.email}`);
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
