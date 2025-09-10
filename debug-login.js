const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function debugLogin() {
  const prisma = new PrismaClient();

  try {
    console.log('Checking database connection...');

    // Check if admin user exists
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@hostel.com' }
    });

    if (!adminUser) {
      console.log('Admin user not found!');
      return;
    }

    console.log('Admin user found:');
    console.log('- ID:', adminUser.id);
    console.log('- Email:', adminUser.email);
    console.log('- Role:', adminUser.role);
    console.log('- Has password:', !!adminUser.password);

    // Test password comparison
    const testPassword = 'password123';
    const isValid = await bcrypt.compare(testPassword, adminUser.password);
    console.log('- Password valid:', isValid);

    if (!isValid) {
      console.log('Password mismatch! Re-creating user with correct password...');

      const hashedPassword = await bcrypt.hash(testPassword, 12);
      await prisma.user.update({
        where: { id: adminUser.id },
        data: { password: hashedPassword }
      });

      console.log('Password updated successfully!');
    }

  } catch (error) {
    console.error('Database error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

debugLogin();
