const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const url = 'mongodb://localhost:27018';
const dbName = 'hostel_management';

async function createAdmin() {
  const client = new MongoClient(url);
  
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected successfully');
    
    const db = client.db(dbName);
    const usersCollection = db.collection('User');
    
    // Check if admin already exists
    const existingAdmin = await usersCollection.findOne({ email: 'admin@hostel.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }
    
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const adminUser = {
      name: 'Admin',
      email: 'admin@hostel.com',
      password: hashedPassword,
      role: 'ADMIN',
      studentId: 'ADMIN001',
      hostelId: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('Creating admin user...');
    const result = await usersCollection.insertOne(adminUser);
    console.log('Admin user created successfully:', result.insertedId);
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

createAdmin();
