const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const http = require('http'); // Required for Socket.IO
const { Server } = require('socket.io');
const Message = require('./models/Message'); // Import the Message model

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app); // Create an HTTP server

// Define allowed origins
const allowedOrigins = ['http://localhost:3000', 'https://chattrhive.netlify.app'];

// CORS setup for Socket.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
  },
});

// Store online users in memory (or use a database)
let onlineUsers = {};

app.use(express.json());

// CORS setup for REST APIs
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', chatRoutes); // Mount chat routes

// Socket.IO logic
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Listen for joining a user to a specific room
  socket.on('join', (userId) => {
    onlineUsers[userId] = socket.id; // Store the socket id with the userId
    console.log(`User ${userId} joined room ${userId}`);

    // Broadcast that the user is online
    socket.broadcast.emit('userStatus', { userId, status: 'online' });

    // Join the user to their own room
    socket.join(userId);
  });

  // Listen for sending messages
  socket.on('sendMessage', async (data) => {
    const { sender, receiver, content } = data;

    try {
      // Save the message to the database
      const message = await Message.create({ sender, receiver, content });

      // Emit the message to the receiver's room and the sender's room
      io.to(receiver).emit('receiveMessage', message);
      io.to(sender).emit('receiveMessage', message); // Feedback to the sender
    } catch (error) {
      console.error('Error saving message:', error);

      // Notify the sender about the failure
      io.to(sender).emit('errorMessage', {
        error: 'Failed to send message. Please try again.',
      });
    }
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    // Find the user that disconnected by their socket id
    for (let userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId]; // Remove user from onlineUsers
        console.log(`User ${userId} disconnected`);

        // Broadcast that the user is offline
        io.emit('userStatus', { userId, status: 'offline' });
        break;
      }
    }
  });
});

// Add an API route to fetch online users (optional)
app.get('/api/onlineUsers', (req, res) => {
  // Send the list of online users
  res.json(Object.keys(onlineUsers)); // Return only the userIds of online users
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
