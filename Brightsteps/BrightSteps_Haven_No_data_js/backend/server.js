
import dns from 'node:dns';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';

import parentRoutes from './routes/parentRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dns.setServers(['8.8.8.8', '8.8.4.4']);

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

// Local development can use config.env.
// Render provides environment variables through its dashboard.
dotenv.config({
  path: path.join(currentDirectory, 'config.env')
});

const app = express();
const PORT = process.env.PORT || 5000;

if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET environment variable is missing.');
}

if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI environment variable is missing.');
}

// GitHub Pages site origin (without the repository path).
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://jasmeengrewal381-cpu.github.io',
  process.env.FRONTEND_URL
].filter(Boolean);

if (process.env.NODE_ENV === 'production') {
  // Required for secure session cookies behind Render's proxy.
  app.set('trust proxy', 1);
}

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin not allowed by CORS: ${origin}`));
  },
  credentials: true
}));

app.use(express.json({ limit: '20kb' }));

app.use(session({
  name: 'brightsteps.sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 2
  }
}));

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'BrightSteps Haven backend is running.'
  });
});

app.use('/api/enquiries', enquiryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/parents', parentRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found.'
  });
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected.');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`BrightSteps Haven backend is running on port ${PORT}.`);
    });
  } catch (error) {
    console.error('Backend startup failed:', error.message);
    process.exit(1);
  }
}

startServer();
