const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const http = require('http');
const server = http.createServer(app);
let io = null;

// Middleware
// Allow multiple frontend origins via env (comma-separated) or single CLIENT_URL/FRONTEND_URL
const rawAllowed = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:3000';
const allowedOrigins = rawAllowed.split(',').map(s => s && s.trim()).filter(Boolean);

// Always allow Vercel preview domains
const isVercelPreview = (origin) => {
  if (!origin) return false;
  return origin.includes('vercel.app') || 
         origin.includes('localhost') || 
         allowedOrigins.includes(origin);
};

app.use(cors({
  origin: (origin, callback) => {
    if (isVercelPreview(origin)) return callback(null, true);
    // Not allowed by CORS
    return callback(new Error(`CORS policy: origin ${origin} is not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/quizzes', require('./routes/quizzes'));
app.use('/api/scores', require('./routes/scores'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/ai', require('./routes/ai'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Socket.io setup (multiplayer battles)
try {
  const { Server } = require('socket.io');
  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('CORS error'));
      },
      credentials: true
    }
  });
  require('./socket/battle')(io);
} catch (e) {
  console.warn('Socket.io not initialized:', e?.message || e);
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
