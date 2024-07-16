const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path'); // Tambahkan ini untuk menggunakan path.join
const authRoutes = require('./routes/authRoutes');
const sequelize = require('./config/db');
const User = require('./models/userModel');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware untuk parsing JSON
app.use(express.json());

// Menyajikan file statis dari direktori 'frontend'
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Rute untuk autentikasi
app.use('/api/auth', authRoutes);

// Objek untuk menyimpan user yang terhubung
const connectedUsers = {};

// Rute utama untuk mengirimkan index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// WebSocket untuk chat real-time
io.on('connection', (socket) => {
  console.log('New client connected');

  // Event ketika user join chat
  socket.on('join', (user) => {
    connectedUsers[socket.id] = user;
    socket.broadcast.emit('userJoined', user);
  });

  // Event ketika user mengirim pesan
  socket.on('sendMessage', ({ token, message }) => {
    const username = connectedUsers[socket.id]; 
    io.emit('receiveMessage', { username, message });
  });

  // Event ketika user disconnect
  socket.on('disconnect', () => {
    const username = connectedUsers[socket.id];
    delete connectedUsers[socket.id];
    console.log(`Client disconnected: ${username}`);
  });
});

// Sinkronisasi dengan database dan mulai server
sequelize.sync()
  .then(() => {
    server.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
