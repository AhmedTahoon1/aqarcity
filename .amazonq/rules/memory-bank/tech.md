# Technology Stack & Development Setup

## Core Technologies

### Frontend Stack
- **React 18.2.0**: Modern React with hooks and concurrent features
- **TypeScript 5.2.2**: Full type safety across the application
- **Vite 5.0.8**: Fast build tool and development server
- **Tailwind CSS 3.3.6**: Utility-first CSS framework
- **Wouter 2.12.1**: Lightweight client-side routing

### Backend Stack
- **Node.js**: JavaScript runtime environment
- **Express.js 4.18.2**: Web application framework
- **TypeScript 5.3.3**: Type-safe server-side development
- **PostgreSQL**: Primary database system
- **Drizzle ORM 0.29.1**: Type-safe database toolkit

## State Management & Data Fetching
- **Zustand 5.0.8**: Lightweight state management
- **TanStack React Query 4.36.1**: Server state management and caching
- **Axios 1.6.2**: HTTP client for API requests

## UI & Animation Libraries
- **Framer Motion 12.23.22**: Advanced animations and transitions
- **Lucide React 0.294.0**: Modern icon library
- **Tailwind Merge 2.6.0**: Utility class merging
- **clsx 2.1.1**: Conditional class name utility

## Internationalization
- **i18next 23.7.6**: Internationalization framework
- **react-i18next 13.5.0**: React integration for i18n
- **i18next-browser-languagedetector 7.2.0**: Automatic language detection

## Authentication & Security
- **JWT (jsonwebtoken 9.0.2)**: Token-based authentication
- **bcryptjs 2.4.3**: Password hashing
- **jwt-decode 4.0.0**: Client-side JWT decoding
- **Helmet 7.1.0**: Security headers middleware
- **express-rate-limit 7.1.5**: API rate limiting

## External Integrations
- **Cloudinary 1.41.0**: Image and media management
- **Twilio 4.19.0**: WhatsApp and SMS messaging
- **Nodemailer 6.9.7**: Email sending capabilities
- **OpenAI 4.20.1**: AI-powered features
- **Socket.io 4.7.4**: Real-time communication

## Database & ORM
- **PostgreSQL (pg 8.11.3)**: Relational database
- **Drizzle ORM 0.29.1**: Type-safe database operations
- **Drizzle Kit 0.20.6**: Database migration and introspection tools

## Development Tools
- **tsx 4.6.2**: TypeScript execution for Node.js
- **concurrently 8.2.2**: Run multiple commands simultaneously
- **PostCSS 8.4.32**: CSS processing
- **Autoprefixer 10.4.16**: CSS vendor prefixing

## Build & Development Commands

### Root Level Commands
```bash
# Development
npm run dev                    # Start both client and server
npm run dev:client            # Start frontend only
npm run dev:server            # Start backend only

# Production Build
npm run build                 # Build both client and server
npm run build:client         # Build frontend
npm run build:server         # Build backend
npm start                     # Start production server

# Database Operations
npm run db:generate           # Generate database migrations
npm run db:push              # Push schema changes
npm run db:migrate           # Run migrations
npm run db:seed              # Seed database with sample data
npm run db:seed-properties   # Seed properties specifically
npm run db:add-agent         # Add default agent
npm run check:users          # Check user data
```

### Client Commands
```bash
cd client
npm run dev                   # Start development server
npm run build                # Build for production
npm run preview              # Preview production build
```

## Environment Configuration

### Required Environment Variables
```bash
# Database
DATABASE_URL=postgresql://...

# Authentication
JWT_SECRET=your-secret-key

# External Services
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_WHATSAPP_NUMBER=whatsapp:+...

OPENAI_API_KEY=your-openai-key

# Email Configuration
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password
```

## Development Workflow

### Project Setup
1. Clone repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Initialize database: `npm run db:migrate`
5. Seed data: `npm run db:seed`
6. Start development: `npm run dev`

### Database Workflow
1. Modify schema in `shared/schema.ts`
2. Generate migration: `npm run db:generate`
3. Apply migration: `npm run db:migrate`
4. Update seed data if needed

### Frontend Development
- Components in `client/src/components/`
- Pages in `client/src/pages/`
- Hooks in `client/src/hooks/`
- Styles with Tailwind CSS classes
- Animations with Framer Motion

### Backend Development
- Routes in `server/routes/`
- Business logic in `server/services/`
- Middleware in `server/middleware/`
- Database operations with Drizzle ORM

## Performance Optimizations
- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: Cloudinary transformations
- **Caching**: React Query for server state
- **Bundle Optimization**: Vite's tree shaking and minification
- **Database Indexing**: Strategic indexes on frequently queried columns