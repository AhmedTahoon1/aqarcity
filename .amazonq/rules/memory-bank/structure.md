# Aqar City UAE - Project Structure

## Directory Organization

### Root Level Structure
```
aqarcity/
├── .amazonq/                    # Amazon Q configuration and rules
├── .env                         # Environment variables (development)
├── .gitignore                   # Git ignore patterns
├── db.js                        # Database connection configuration
├── aqar_city_project_plan.yaml  # Comprehensive project specification
├── design_guidelines_replit.md  # UI/UX design standards
├── PROJECT_PLAN_replit.md       # Detailed implementation roadmap
└── AqarCityUAE*.zip            # Project archives
```

## Core Components & Architecture

### Database Layer
- **Primary Database**: PostgreSQL with Drizzle ORM
- **Connection Management**: Centralized pool configuration in `db.js`
- **Schema Location**: Planned in `shared/schema.ts` (to be implemented)
- **Migration Path**: `drizzle/migrations/` (to be created)

### Backend Architecture (Planned)
```
server/
├── routes/          # API endpoint definitions
├── services/        # Business logic and external integrations
├── middleware/      # Authentication, validation, error handling
├── socket.ts        # Real-time communication setup
└── index.ts         # Main server entry point
```

### Frontend Architecture (Planned)
```
client/
├── src/
│   ├── components/  # Reusable UI components
│   ├── pages/       # Route-based page components
│   ├── hooks/       # Custom React hooks
│   ├── lib/         # Utility libraries and configurations
│   ├── i18n/        # Internationalization setup
│   └── styles/      # Global styling
└── public/          # Static assets and PWA files
```

### Shared Resources (Planned)
```
shared/
└── schema.ts        # Database schemas and TypeScript types
```

## Architectural Patterns

### Full-Stack TypeScript
- **Frontend**: React 18 with TypeScript
- **Backend**: Node.js with Express and TypeScript
- **Database**: PostgreSQL with Drizzle ORM (type-safe)
- **Shared Types**: Common interfaces and schemas

### Component-Based Architecture
- **UI Components**: Shadcn UI with Tailwind CSS
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for lightweight client-side routing
- **Real-time**: Socket.io for bidirectional communication

### Service-Oriented Backend
- **Route Handlers**: Express.js controllers for API endpoints
- **Service Layer**: Business logic abstraction
- **Middleware Stack**: Authentication, validation, error handling
- **External Services**: OpenAI, Twilio, Google Maps integrations

## Data Flow Architecture

### Client-Server Communication
1. **REST APIs**: Standard HTTP endpoints for CRUD operations
2. **WebSocket**: Real-time messaging and notifications
3. **File Uploads**: Image and document handling
4. **Authentication**: JWT-based session management

### Database Design Patterns
- **Relational Structure**: Normalized tables with foreign key relationships
- **Indexing Strategy**: Optimized queries for property search and filtering
- **Audit Trails**: Activity logging and user action tracking
- **Soft Deletes**: Data preservation with status flags

## Integration Points

### External Service Architecture
- **AI Services**: OpenAI API for chatbot and content generation
- **Communication**: Twilio WhatsApp API for messaging
- **Maps & Location**: Google Maps API for property visualization
- **Analytics**: Google Analytics and Meta Pixel integration
- **Storage**: Cloudinary or AWS S3 for media files

### Authentication & Authorization
- **Multi-Provider OAuth**: Google, Apple, GitHub integration
- **Role-Based Access**: Hierarchical permission system
- **Session Management**: JWT tokens with refresh mechanism

## Development Environment Structure

### Configuration Management
- **Environment Variables**: Centralized in `.env` files
- **Build Configuration**: Vite for frontend, Node.js for backend
- **Database Configuration**: Connection pooling and migration management

### Code Organization Principles
- **Separation of Concerns**: Clear boundaries between layers
- **Modular Design**: Reusable components and services
- **Type Safety**: End-to-end TypeScript implementation
- **Scalable Structure**: Organized for team collaboration and growth

## Deployment Architecture (Planned)

### Production Structure
- **Frontend**: Static site deployment (Vercel/Netlify)
- **Backend**: Server deployment (AWS/Render)
- **Database**: Managed PostgreSQL instance
- **CDN**: Cloudflare for global content delivery
- **Monitoring**: Error tracking and performance monitoring

This structure supports the project's evolution from a simple property listing platform to a comprehensive real estate ecosystem with advanced features like AI integration, real-time communication, and comprehensive analytics.