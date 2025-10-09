# Aqar City UAE - Technology Stack

## Programming Languages & Frameworks

### Frontend Stack
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe JavaScript for better development experience
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Shadcn UI**: High-quality, accessible component library

### Backend Stack
- **Node.js**: JavaScript runtime for server-side development
- **Express.js**: Minimal and flexible web application framework
- **TypeScript**: Type safety across the entire backend codebase

### Database & ORM
- **PostgreSQL**: Robust relational database system
- **Drizzle ORM**: Type-safe and performant TypeScript ORM
- **Connection Pooling**: Efficient database connection management

## Development Environment

### Build System & Tools
- **Package Manager**: npm or pnpm for dependency management
- **Build Tool**: Vite for frontend bundling and development
- **TypeScript Compiler**: tsc for type checking and compilation
- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting and consistency

### Development Commands
```bash
# Install dependencies
npm install

# Start development servers
npm run dev:client    # Frontend development server
npm run dev:server    # Backend development server

# Database operations
npm run db:generate   # Generate Drizzle migrations
npm run db:migrate    # Run database migrations
npm run db:seed       # Seed database with sample data

# Build for production
npm run build         # Build both client and server
npm run build:client  # Build frontend only
npm run build:server  # Build backend only

# Testing
npm run test          # Run all tests
npm run test:unit     # Unit tests
npm run test:e2e      # End-to-end tests

# Code quality
npm run lint          # Run ESLint
npm run format        # Format code with Prettier
npm run type-check    # TypeScript type checking
```

## Core Dependencies

### Frontend Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "typescript": "^5.0.0",
  "@vitejs/plugin-react": "^4.0.0",
  "tailwindcss": "^3.3.0",
  "@radix-ui/react-*": "^1.0.0",
  "wouter": "^2.12.0",
  "@tanstack/react-query": "^4.32.0",
  "react-i18next": "^13.0.0",
  "i18next": "^23.0.0",
  "socket.io-client": "^4.7.0",
  "@react-google-maps/api": "^2.19.0"
}
```

### Backend Dependencies
```json
{
  "express": "^4.18.0",
  "typescript": "^5.0.0",
  "drizzle-orm": "^0.28.0",
  "pg": "^8.11.0",
  "jsonwebtoken": "^9.0.0",
  "bcryptjs": "^2.4.0",
  "dotenv": "^16.3.0",
  "cors": "^2.8.0",
  "helmet": "^7.0.0",
  "express-rate-limit": "^6.8.0",
  "socket.io": "^4.7.0",
  "nodemailer": "^6.9.0",
  "twilio": "^4.14.0",
  "openai": "^4.0.0",
  "cloudinary": "^1.40.0"
}
```

## Environment Configuration

### Required Environment Variables
```env
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/aqar_city_db
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=aqar_city_db

# Server Configuration
NODE_ENV=development
PORT=5000
BASE_URL=http://localhost:5000
CLIENT_URL=http://localhost:3000

# Authentication & Security
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# OAuth Providers
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
APPLE_CLIENT_ID=your_apple_client_id
GITHUB_CLIENT_ID=your_github_client_id

# AI Services
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4-turbo

# Communication Services
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+971XXXXXXXXX

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Maps & Analytics
VITE_GOOGLE_MAPS_API_KEY=your_maps_api_key
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_META_PIXEL_ID=XXXXXXXXXXXXXXX

# Cloud Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## External Integrations

### AI & Machine Learning
- **OpenAI GPT-4**: Chatbot functionality and content generation
- **Model**: gpt-4-turbo for optimal performance and cost balance
- **Use Cases**: Property descriptions, user assistance, recommendations

### Communication Services
- **Twilio WhatsApp Business API**: Direct messaging with clients
- **Nodemailer**: Email notifications and transactional emails
- **Socket.io**: Real-time bidirectional communication

### Maps & Location Services
- **Google Maps JavaScript API**: Interactive property maps
- **Geocoding API**: Address to coordinates conversion
- **Places API**: Location search and autocomplete

### Analytics & Tracking
- **Google Analytics 4**: User behavior and conversion tracking
- **Meta Pixel**: Facebook advertising and retargeting
- **Custom Analytics**: Property views, inquiries, and engagement metrics

### Cloud Services
- **Cloudinary**: Image storage, optimization, and transformation
- **Alternative**: AWS S3 for file storage and CloudFront for CDN

## Development Workflow

### Version Control
- **Git**: Source code version control
- **GitHub**: Repository hosting and collaboration
- **Branching Strategy**: Feature branches with pull request reviews

### Code Quality Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Airbnb configuration with custom rules
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality checks

### Testing Strategy
- **Unit Tests**: Vitest for component and utility testing
- **Integration Tests**: API endpoint testing with Supertest
- **E2E Tests**: Playwright for full user journey testing
- **Coverage**: Minimum 80% code coverage requirement

## Performance Optimization

### Frontend Optimization
- **Code Splitting**: React.lazy for route-based splitting
- **Tree Shaking**: Unused code elimination
- **Image Optimization**: WebP format with fallbacks
- **Bundle Analysis**: Webpack Bundle Analyzer for size monitoring

### Backend Optimization
- **Database Indexing**: Optimized queries for property search
- **Connection Pooling**: Efficient database connection management
- **Caching**: Redis for session and query caching
- **Compression**: Gzip compression for API responses

### Progressive Web App (PWA)
- **Service Worker**: Offline functionality and caching
- **Web App Manifest**: Native app-like installation
- **Push Notifications**: Web Push API for user engagement

## Security Implementation

### Authentication & Authorization
- **JWT Tokens**: Secure session management
- **OAuth 2.0**: Third-party authentication providers
- **Role-Based Access Control**: Hierarchical permission system
- **Password Hashing**: bcrypt for secure password storage

### Data Protection
- **Input Validation**: Zod schemas for request validation
- **SQL Injection Prevention**: Parameterized queries with Drizzle ORM
- **XSS Protection**: Content Security Policy headers
- **Rate Limiting**: API endpoint protection against abuse

This technology stack provides a solid foundation for building a scalable, secure, and feature-rich real estate platform that can handle the demands of the UAE market while maintaining excellent performance and user experience.