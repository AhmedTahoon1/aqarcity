# Development Guidelines & Standards

## Code Quality Standards

### TypeScript Usage
- **Full Type Safety**: All files use TypeScript with strict typing
- **Interface Definitions**: Comprehensive type definitions in `shared/schema.ts`
- **Type Inference**: Leverage Drizzle ORM's `$inferSelect` and `$inferInsert` for database types
- **Generic Types**: Use generics for reusable components and API responses

### Import Organization
- **Absolute Imports**: Use `@/` prefix for client-side imports
- **Relative Imports**: Use relative paths for server-side modules
- **Import Grouping**: External libraries first, then internal modules
- **Consistent Paths**: Maintain consistent import patterns across similar files

### Error Handling Patterns
- **Try-Catch Blocks**: Wrap all async operations in try-catch
- **Detailed Logging**: Include error stack traces and context in console.error
- **User-Friendly Messages**: Return meaningful error messages to clients
- **Status Codes**: Use appropriate HTTP status codes (404, 500, etc.)

## Frontend Development Standards

### Component Architecture
- **Functional Components**: Use React functional components exclusively
- **Custom Hooks**: Extract reusable logic into custom hooks (useAuth, useFavorites)
- **Component Composition**: Break complex components into smaller, focused pieces
- **Lazy Loading**: Use React.lazy() for route-based code splitting

### State Management Patterns
- **React Query**: Use for server state management and caching
- **Zustand**: Use for client-side global state (compare store)
- **Local State**: Use useState for component-specific state
- **Context**: Use React Context for authentication and theme

### Styling Conventions
- **Tailwind CSS**: Use utility-first CSS classes
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Component Variants**: Create reusable button and card variants
- **CSS Classes**: Use semantic class names for complex components

### Internationalization Standards
- **Bilingual Support**: Full Arabic and English support
- **Translation Keys**: Use structured translation keys (property.bedrooms)
- **RTL Support**: Handle right-to-left layout for Arabic
- **Language Detection**: Automatic language detection and switching

## Backend Development Standards

### API Design Patterns
- **RESTful Endpoints**: Follow REST conventions for resource operations
- **Consistent Response Format**: Standardized JSON response structure
- **Query Parameters**: Use query params for filtering and pagination
- **Status Codes**: Appropriate HTTP status codes for different scenarios

### Database Interaction
- **Drizzle ORM**: Use Drizzle for all database operations
- **Query Optimization**: Use indexes and efficient query patterns
- **Relationship Handling**: Proper use of joins and relations
- **Transaction Management**: Use transactions for multi-table operations

### Authentication & Authorization
- **JWT Tokens**: Use JSON Web Tokens for authentication
- **Role-Based Access**: Implement role-based authorization middleware
- **Protected Routes**: Secure endpoints with authentication middleware
- **Password Security**: Use bcryptjs for password hashing

## Database Design Patterns

### Schema Organization
- **Enum Definitions**: Use PostgreSQL enums for constrained values
- **UUID Primary Keys**: Use UUID for all primary keys
- **Timestamp Fields**: Include createdAt and updatedAt for audit trails
- **JSON Fields**: Use JSON columns for flexible data structures

### Indexing Strategy
- **Performance Indexes**: Strategic indexes on frequently queried columns
- **Composite Indexes**: Multi-column indexes for complex queries
- **Foreign Key Indexes**: Indexes on foreign key columns
- **Search Optimization**: Indexes for text search operations

### Relationship Patterns
- **One-to-Many**: Users → Favorites, Agents → Properties
- **Many-to-Many**: Properties ↔ Users (via Favorites table)
- **Optional Relations**: Nullable foreign keys for flexible associations
- **Cascade Handling**: Proper cascade rules for data integrity

## API Integration Patterns

### External Service Integration
- **Service Classes**: Dedicated service classes for external APIs
- **Error Handling**: Graceful handling of external service failures
- **Configuration**: Environment-based configuration for API keys
- **Rate Limiting**: Implement rate limiting for API endpoints

### Real-time Features
- **Socket.io**: Use for real-time chat and notifications
- **Event-Driven**: Event-based architecture for real-time updates
- **Connection Management**: Proper connection handling and cleanup
- **Namespace Organization**: Organized socket namespaces by feature

## Security Best Practices

### Data Protection
- **Input Validation**: Validate all user inputs
- **SQL Injection Prevention**: Use parameterized queries
- **XSS Protection**: Sanitize user-generated content
- **CORS Configuration**: Proper CORS setup for API access

### Authentication Security
- **Token Expiration**: Implement token expiration and refresh
- **Secure Headers**: Use Helmet.js for security headers
- **Password Policies**: Enforce strong password requirements
- **Session Management**: Secure session handling

## Performance Optimization

### Frontend Performance
- **Code Splitting**: Route-based and component-based splitting
- **Image Optimization**: Use Cloudinary for image transformations
- **Caching Strategy**: React Query caching for API responses
- **Bundle Optimization**: Tree shaking and minification

### Backend Performance
- **Database Optimization**: Efficient queries and proper indexing
- **Response Caching**: Cache frequently requested data
- **Pagination**: Implement pagination for large datasets
- **Connection Pooling**: Database connection pooling

## Testing & Quality Assurance

### Code Quality Tools
- **TypeScript Strict Mode**: Enable strict TypeScript checking
- **ESLint Configuration**: Consistent code formatting and linting
- **Error Boundaries**: React error boundaries for graceful failures
- **Logging Strategy**: Comprehensive logging for debugging

### Development Workflow
- **Environment Separation**: Clear separation of dev/staging/production
- **Migration Management**: Proper database migration handling
- **Seed Data**: Consistent seed data for development
- **Documentation**: Inline comments for complex business logic

## Naming Conventions

### File Naming
- **PascalCase**: React components (PropertyCard.tsx)
- **camelCase**: Utility functions and hooks (useAuth.ts)
- **kebab-case**: Route files and directories
- **Descriptive Names**: Clear, descriptive file names

### Variable Naming
- **camelCase**: Variables and functions
- **PascalCase**: Types and interfaces
- **UPPER_CASE**: Constants and environment variables
- **Semantic Names**: Meaningful variable names that describe purpose

### Database Naming
- **snake_case**: Database table and column names
- **Plural Tables**: Table names in plural form (users, properties)
- **Descriptive Columns**: Clear column names (created_at, user_id)
- **Consistent Prefixes**: Consistent naming patterns across tables