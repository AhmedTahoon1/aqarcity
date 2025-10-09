# Aqar City UAE - Development Guidelines

## Code Quality Standards

### Import Organization
- **ES6 Modules**: Use `import/export` syntax consistently throughout the codebase
- **External Dependencies First**: Import third-party packages before local modules
- **Logical Grouping**: Group related imports together with clear separation
- **Example Pattern**:
```javascript
import pg from "pg";
import dotenv from "dotenv";

import localModule from "./local-module.js";
```

### Environment Configuration Management
- **Centralized Configuration**: Use `dotenv.config()` at the top of entry files
- **Environment Variable Access**: Access all configuration through `process.env`
- **Consistent Naming**: Use uppercase with underscores for environment variables
- **Required Pattern**:
```javascript
dotenv.config();

const config = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};
```

### Database Connection Patterns
- **Connection Pooling**: Always use connection pools for database connections
- **Destructuring**: Extract specific classes/functions from imported modules
- **Configuration Objects**: Use clear, readable configuration objects
- **Example Implementation**:
```javascript
const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
```

## Error Handling Standards

### Connection Error Management
- **Promise-Based Error Handling**: Use `.then()` and `.catch()` for async operations
- **Descriptive Error Messages**: Include context and visual indicators in error messages
- **Console Logging**: Use appropriate console methods (`console.log`, `console.error`)
- **Visual Indicators**: Use emojis or symbols for quick visual identification
- **Standard Pattern**:
```javascript
pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL successfully"))
  .catch((err) => console.error("❌ Connection error:", err.stack));
```

### Error Message Formatting
- **Success Messages**: Use green checkmark (✅) for successful operations
- **Error Messages**: Use red X (❌) for error conditions
- **Descriptive Context**: Include operation context in messages
- **Stack Trace**: Include `err.stack` for debugging information

## Module Export Patterns

### Default Exports
- **Single Responsibility**: Export one main entity per module
- **Clear Naming**: Use descriptive names for exported entities
- **Consistent Pattern**: Use `export default` for primary module exports
- **Example**:
```javascript
export default pool;
```

## Code Formatting Standards

### Line Endings and Spacing
- **Windows Line Endings**: Use CRLF (`\r\n`) line endings consistently
- **Clean Separation**: Use blank lines to separate logical code blocks
- **Consistent Indentation**: Use 2-space indentation throughout

### Semicolon Usage
- **Consistent Semicolons**: Always use semicolons to terminate statements
- **Method Chaining**: Include semicolons after chained method calls

## Configuration Management Patterns

### Database Configuration
- **Environment-Driven**: All database settings come from environment variables
- **No Hardcoded Values**: Never include credentials or connection strings in code
- **Validation**: Ensure all required environment variables are available
- **Type Conversion**: Convert string environment variables to appropriate types when needed

### Service Initialization
- **Immediate Connection Testing**: Test connections immediately after configuration
- **Graceful Failure**: Handle connection failures with informative error messages
- **Resource Management**: Properly manage database connections and pools

## Architectural Patterns

### Service Layer Pattern
- **Single Responsibility**: Each service module handles one specific concern
- **Database Abstraction**: Abstract database operations behind service interfaces
- **Connection Reuse**: Export configured service instances for reuse across the application

### Configuration Pattern
- **Environment-First**: Load environment configuration before any other operations
- **Fail-Fast**: Validate critical configuration early in the application lifecycle
- **Centralized Access**: Provide single points of access for shared resources

## Best Practices

### Resource Management
- **Connection Pooling**: Always use connection pools for database access
- **Proper Cleanup**: Ensure resources are properly cleaned up on application shutdown
- **Error Recovery**: Implement appropriate error recovery mechanisms

### Development Workflow
- **Environment Variables**: Use `.env` files for local development configuration
- **Error Visibility**: Make errors visible and actionable for developers
- **Logging Standards**: Use consistent logging patterns throughout the application

### Security Considerations
- **No Credentials in Code**: Never commit database credentials or API keys
- **Environment Validation**: Validate that all required environment variables are present
- **Connection Security**: Use secure connection parameters for production databases

## Code Documentation

### Inline Comments
- **Minimal Comments**: Write self-documenting code that requires minimal comments
- **Context Comments**: Add comments only when business logic or technical decisions need explanation
- **Visual Indicators**: Use emojis or symbols in console messages for quick identification

### Module Documentation
- **Clear Purpose**: Each module should have a clear, single purpose
- **Export Documentation**: Document what each module exports and how it should be used
- **Dependencies**: Clearly indicate external dependencies and their purposes

These guidelines ensure consistency, maintainability, and reliability across the Aqar City UAE codebase while following modern JavaScript/Node.js development practices.