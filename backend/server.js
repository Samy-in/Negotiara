const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const negotiationRoutes = require('./src/routes/negotiationRoutes');
const { protect, authorize } = require('./src/middleware/auth');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust in production
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/negotiation', negotiationRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'Backend is running',
    timestamp: new Date().toISOString(),
    database: 'Checking...'
  });
});

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server', error: err.message });
});

// WebSockets for Real-time streaming
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);

  socket.on('join_negotiation', (negotiationId) => {
    socket.join(negotiationId);
    console.log(`User joined negotiation: ${negotiationId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, async () => {
  console.log(`Express Backend listening on port ${PORT}`);

  // Test Prisma Connection
  const prisma = require('./src/config/db');
  try {
    await prisma.$connect();
    console.log('Successfully connected to Database via Prisma');
  } catch (err) {
    console.error('CRITICAL: Prisma failed to connect to Database.');
    console.error('Msg:', err.message);
    console.log('Server will remain active for health-checks, but DB operations will fail.');
  }
});
