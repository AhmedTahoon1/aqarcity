import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for Replit environment
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: true,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 1000 : 100, // Higher limit for development
  message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Import routes
import authRoutes from './routes/auth.js';
import propertiesRoutes from './routes/properties.js';
import agentsRoutes from './routes/agents.js';
import developersRoutes from './routes/developers.js';
import favoritesRoutes from './routes/favorites.js';
import inquiriesRoutes from './routes/inquiries.js';
import analyticsRoutes from './routes/analytics.js';
import careersRoutes from './routes/careers.js';
import notificationsRoutes from './routes/notifications.js';
import locationsRoutes from './routes/locations.js';
import savedSearchesRoutes from './routes/saved-searches.js';

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/properties', propertiesRoutes);
app.use('/api/v1/agents', agentsRoutes);
app.use('/api/v1/developers', developersRoutes);
app.use('/api/v1/favorites', favoritesRoutes);
app.use('/api/v1/inquiries', inquiriesRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/careers', careersRoutes);
app.use('/api/v1/notifications', notificationsRoutes);
app.use('/api/v1/locations', locationsRoutes);
app.use('/api/v1/saved-searches', savedSearchesRoutes);

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// API info endpoint
app.get('/api/v1', (req, res) => {
  res.json({ 
    message: 'Aqar City UAE API v1.0',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      properties: '/api/v1/properties',
      agents: '/api/v1/agents',
      developers: '/api/v1/developers',
      favorites: '/api/v1/favorites',
      inquiries: '/api/v1/inquiries',
      analytics: '/api/v1/analytics',
      careers: '/api/v1/careers'
    }
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/dist'));
  
  // Serve index.html for all non-API routes (SPA routing)
  app.get('*', (req, res) => {
    res.sendFile('index.html', { root: 'client/dist' });
  });
}

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
});

// 404 handler for API routes only (in development)
if (process.env.NODE_ENV !== 'production') {
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`📡 API URL: http://localhost:${PORT}/api/v1`);
});
