# Aqar City UAE - Real Estate Platform

## Overview
Aqar City UAE is a dynamic and intelligent real estate platform designed specifically for the United Arab Emirates market. The platform features property listings, agent profiles, developer information, job postings, and more.

## Project Architecture

### Technology Stack
- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Internationalization**: i18next (English & Arabic support)
- **State Management**: TanStack React Query
- **Routing**: Wouter (client-side), Express (server-side)

### Project Structure
```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components (property, layout, shared, ui)
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities and API client
│   │   └── i18n/          # Internationalization config
│   └── dist/              # Production build output
├── server/                 # Backend Express application
│   ├── routes/            # API route handlers
│   ├── middleware/        # Express middleware
│   └── index.ts           # Server entry point
├── shared/                 # Shared TypeScript schemas
├── drizzle/               # Database migrations and seeds
└── dist/                  # Compiled server code
```

## Development Setup

### Environment Variables
The project uses environment variables for configuration:
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` - Database credentials (auto-populated from Replit)
- `PORT` - Server port (3000 for dev, 5000 for production)
- `NODE_ENV` - Environment mode (development/production)
- `JWT_SECRET` - Secret key for JWT authentication
- `VITE_API_URL` - API endpoint for frontend

### Running the Application

**Development Mode:**
- Frontend runs on port 5000 (Vite dev server)
- Backend runs on port 3000 (Express API server)
- Run: `npm run dev` (starts both servers concurrently)

**Production Mode:**
- Single server on port 5000 serving both API and static frontend
- Backend serves built frontend files
- Run: `npm start`

### Database
- PostgreSQL database managed by Replit
- Drizzle ORM for type-safe database queries
- Migrations located in `drizzle/migrations/`
- Run migrations: `npm run db:migrate`

## Key Features
- Multilingual support (English/Arabic)
- Property search and filtering
- Agent and developer profiles
- Job listings
- User authentication and favorites
- Responsive design for all devices
- Archive of sold properties

## Recent Changes
- 2025-10-07: UI/UX and Navigation Updates
  - Enhanced navbar with dropdown menus: "People" (Agents, Developers) and "Info" (About, Jobs, Contact)
  - Removed Archive link from main navigation
  - Redesigned Properties page with horizontal filter layout (removed search bar)
  - Updated authentication pages to use "Register" and "Sign In" terminology
  - Enhanced Arabic translations across Header and authentication pages
  - Confirmed favorites system works for guest users via localStorage with auto-sync on login
  
- 2025-10-07: Initial Replit setup and configuration
  - Configured Vite to use port 5000 with host 0.0.0.0
  - Updated backend to use port 3000 in development
  - Added production mode to serve static frontend
  - Created missing UI components (Button)
  - Fixed import paths for PropertyCard component
  - Configured deployment for Replit VM

## Deployment
- Deployment target: VM (always running)
- Build process: Compiles client and server TypeScript
- The application requires a persistent database connection
- Production server binds to 0.0.0.0:5000

## Notes
- The platform supports both English and Arabic languages
- All monetary values use AED (UAE Dirham)
- Property images and videos can be stored/referenced
- API follows RESTful conventions under `/api/v1/`
