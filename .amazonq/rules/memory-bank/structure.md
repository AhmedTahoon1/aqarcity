# Project Structure & Architecture

## Directory Organization

### Root Level Structure
```
aqarcity/
├── client/          # React frontend application
├── server/          # Express.js backend API
├── shared/          # Shared types and schemas
├── drizzle/         # Database migrations and seeds
├── .amazonq/        # AI assistant rules and memory
└── docs/           # Project documentation
```

## Frontend Architecture (`client/`)

### Core Structure
- **src/components/**: Reusable UI components organized by feature
  - `animations/`: Framer Motion animations and transitions
  - `layout/`: Header, Footer, and layout components
  - `modals/`: Dialog components for user interactions
  - `property/`: Property-specific components (cards, filters, forms)
  - `shared/`: Common components used across features
  - `skeletons/`: Loading state components
  - `ui/`: Base UI components (buttons, inputs, etc.)

- **src/pages/**: Route-based page components
  - Authentication: Login, Register, Profile
  - Property: Properties, PropertyDetails, Compare, Favorites
  - User Features: Messages, Notifications, Settings
  - Business: Agents, Developers, Careers
  - Legal: Privacy, Terms, Disclaimer

- **src/hooks/**: Custom React hooks for state and logic
- **src/contexts/**: React Context providers (Auth, etc.)
- **src/stores/**: Zustand state management
- **src/lib/**: Utility functions and API clients
- **src/i18n/**: Internationalization setup and translations

## Backend Architecture (`server/`)

### API Structure
- **routes/**: Express route handlers organized by feature
  - `auth.ts`: Authentication and user management
  - `properties.ts`: Property CRUD and search operations
  - `agents.ts`: Agent profiles and management
  - `favorites.ts`: User favorites system
  - `saved-searches.ts`: Search alerts and notifications
  - `inquiries.ts`: Property inquiry handling

- **services/**: Business logic and external integrations
  - `search-linking.ts`: Guest-to-user search migration
  - `verification.ts`: Email/WhatsApp verification

- **middleware/**: Express middleware (auth, validation, etc.)
- **utils/**: Helper functions and transformers

## Database Architecture (`shared/schema.ts`)

### Core Entities
- **Users**: Multi-role user system (buyer, agent, admin)
- **Properties**: Comprehensive property data with multilingual support
- **Agents**: Agent profiles with ratings and contact info
- **Developers**: Developer profiles and project portfolios

### Feature Tables
- **Favorites**: User property bookmarking
- **Inquiries**: Property inquiry management
- **SavedSearches**: User search alerts and preferences
- **GuestSearches**: Anonymous user search tracking
- **Notifications**: System-wide notification management
- **Jobs**: Career portal functionality

### Relationship Patterns
- One-to-many: Users → Favorites, Agents → Properties
- Many-to-many: Properties ↔ Users (via Favorites)
- Hierarchical: Users → Agents (role-based inheritance)

## Shared Resources (`shared/`)

### Schema Definition
- **schema.ts**: Drizzle ORM schema with full type safety
- **notifications-schema.ts**: Notification system types
- Comprehensive enums for status, types, and categories
- Relational mapping between all entities

## Database Management (`drizzle/`)

### Migration System
- **migrations/**: SQL migration files with versioning
- **seed files**: Development data population scripts
- **migrate.ts**: Migration runner and database setup

### Development Tools
- Property seeding with realistic UAE data
- User and agent creation utilities
- Location data management for UAE cities/areas

## Architectural Patterns

### Frontend Patterns
- **Component Composition**: Reusable, composable UI components
- **Custom Hooks**: Logic separation and reusability
- **Context + Zustand**: Global state management strategy
- **Route-based Code Splitting**: Optimized loading performance

### Backend Patterns
- **RESTful API Design**: Consistent endpoint structure
- **Middleware Chain**: Authentication, validation, error handling
- **Service Layer**: Business logic separation from routes
- **Type-Safe Database**: Drizzle ORM with full TypeScript integration

### Data Flow
1. Client requests → Express routes
2. Route handlers → Service layer
3. Services → Database via Drizzle ORM
4. Response transformation → Client state update
5. UI re-render with new data

## Integration Points
- **Authentication**: JWT-based with role-based access control
- **File Storage**: Cloudinary for images and media
- **Communication**: Twilio for WhatsApp, Nodemailer for email
- **Real-time**: Socket.io for live chat and notifications
- **AI Integration**: OpenAI for smart features and recommendations