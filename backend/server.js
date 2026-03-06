const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

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

// API Routes
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// Mock endpoint to start negotiation via Python Engine (will be implemented next)
app.post('/api/negotiation/start', async (req, res) => {
    try {
        // Forward to FastAPI Engine...
        res.json({ status: 'Negotiation requested' });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

// WebSockets for Real-time streaming
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Express Backend listening on port ${PORT}`);
});
