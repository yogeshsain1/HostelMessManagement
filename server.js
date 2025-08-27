const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Basic HTTP route for GET /
app.get('/', (req, res) => {
  res.send('WebSocket server is running.');
});
const io = new Server(server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Example: emit a notification every 10 seconds
  setInterval(() => {
    socket.emit('notification', {
      title: 'New Update',
      message: 'This is a real-time notification!',
      type: 'info',
      category: 'system',
      actionUrl: '/dashboard/notifications'
    });
  }, 10000);

  // You can also listen for events from the client and broadcast notifications
  // socket.on('newNotification', (data) => {
  //   io.emit('notification', data);
  // });
});

server.listen(4001, () => {
  console.log('WebSocket server running on http://localhost:4001');
});
