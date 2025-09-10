@echo off
echo Starting MongoDB...
start /b mongod --dbpath "C:\data\db" --port 27018
timeout /t 5 >nul
echo Creating admin user...
mongosh --port 27018 --eval "use hostel_management; db.users.insertOne({email: 'admin@hostel.com', name: 'Admin User', password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', role: 'admin', hostelId: null, roomNumber: null, createdAt: new Date(), updatedAt: new Date()});"
echo Done!
