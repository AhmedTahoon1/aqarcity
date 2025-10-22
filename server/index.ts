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
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:", "wss:"],
    },
  },
}));

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://localhost:5173',
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting - more lenient for addresses endpoint
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 2000 : 500, // Higher limit
  message: { error: 'Too many requests from this IP', retryAfter: 900 }
});

const addressLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: process.env.NODE_ENV === 'development' ? 100 : 50, // Very high for addresses
  message: { error: 'Too many address requests', retryAfter: 60 }
});

app.use('/api/', generalLimiter);
app.use('/api/v1/addresses', addressLimiter);

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
import oauthRoutes from './routes/oauth.js';
import propertiesRoutes from './routes/properties.js';
import agentsRoutes from './routes/agents.js';
import agentTeamsRoutes from './routes/agent-teams.js';
import developersRoutes from './routes/developers.js';
import favoritesRoutes from './routes/favorites.js';
import inquiriesRoutes from './routes/inquiries.js';
import analyticsRoutes from './routes/analytics.js';
import careersRoutes from './routes/careers.js';
import notificationsRoutes from './routes/notifications.js';
import locationsRoutes from './routes/locations.js';
import savedSearchesRoutes from './routes/saved-searches.js';
import guestSearchesRoutes from './routes/guest-searches.js';
import usersRoutes from './routes/users.js';
import citiesRoutes from './routes/cities.js';
import adminCitiesRoutes from './routes/admin/cities.js';
import adminAddressesRoutes from './routes/admin/addresses.js';
import adminFeaturesRoutes from './routes/admin/features.js';
import adminAgentsRoutes from './routes/admin/agents.js';
import addressesRoutes from './routes/addresses.js';
import featuresRoutes from './routes/features.js';

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/oauth', oauthRoutes);
app.use('/api/v1/properties', propertiesRoutes);
app.use('/api/v1/agents', agentsRoutes);
app.use('/api/v1/agent-teams', agentTeamsRoutes);
app.use('/api/v1/developers', developersRoutes);
app.use('/api/v1/favorites', favoritesRoutes);
app.use('/api/v1/inquiries', inquiriesRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/careers', careersRoutes);
app.use('/api/v1/notifications', notificationsRoutes);
app.use('/api/v1/locations', locationsRoutes);
app.use('/api/v1/saved-searches', savedSearchesRoutes);
app.use('/api/v1/guest-searches', guestSearchesRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/cities', citiesRoutes);
app.use('/api/v1/admin/cities', adminCitiesRoutes);
app.use('/api/v1/admin/addresses', adminAddressesRoutes);
app.use('/api/v1/admin/features', adminFeaturesRoutes);
app.use('/api/v1/admin/agents', adminAgentsRoutes);
app.use('/api/v1/addresses', addressesRoutes);
app.use('/api/v1/features', featuresRoutes);

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
      agentTeams: '/api/v1/agent-teams',
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
