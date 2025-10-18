# Frontend Configuration Guide

This document explains how to configure the Job Dashboard frontend for different environments and deployments.

## Configuration System

The frontend uses a centralized configuration system located in `src/config/` with the following structure:

```
src/config/
├── api.config.ts      # API endpoints and settings
├── app.config.ts      # Application settings
└── index.ts           # Configuration exports
```

## Environment Variables

### Required Variables

```env
# Backend API URL (update for each deployment)
VITE_API_BASE_URL=http://localhost:3001
```

### Optional Variables

```env
# Environment override
VITE_ENVIRONMENT=development  # development, staging, production

# App customization
VITE_APP_TITLE=Job Dashboard - Software Engineering Positions
VITE_JOBS_PER_PAGE=50
VITE_REFRESH_INTERVAL=300000

# Feature flags
VITE_ENABLE_AUTO_REFRESH=false
VITE_ENABLE_DARK_MODE=false
VITE_ENABLE_ANALYTICS=false

# Development settings
VITE_DEBUG_MODE=true
VITE_SHOW_DEBUG_INFO=true
```

## Deployment Configurations

### Local Development
```env
VITE_API_BASE_URL=http://localhost:3001
VITE_ENVIRONMENT=development
VITE_DEBUG_MODE=true
```

### Render.com Deployment
```env
VITE_API_BASE_URL=https://your-backend-service.onrender.com
VITE_ENVIRONMENT=production
```

### Vercel Deployment
```env
VITE_API_BASE_URL=https://your-backend.vercel.app
VITE_ENVIRONMENT=production
```

### Custom Domain
```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_ENVIRONMENT=production
```

## Runtime Configuration Management

### Using Config Manager (Development)

In development mode, you can switch environments at runtime:

```javascript
// Available in browser console
switchToLocal()        // Switch to localhost:3001
switchToProduction()   // Switch to production URL
switchToStaging()      // Switch to staging URL
testApi()             // Test current API connection
```

### Programmatic Configuration

```typescript
import { configManager } from './src/utils/config-manager';

// Switch environment
configManager.switchEnvironment('production');

// Update API URL directly
configManager.updateApiUrl('https://new-api-url.com');

// Test connection
const isConnected = await configManager.testConnection();

// Get current config
const config = configManager.getCurrentConfig();
```

## API Endpoints Configuration

The API endpoints are centrally defined in `src/config/api.config.ts`:

```typescript
export const API_ROUTES = {
  jobs: {
    list: '/api/v1/jobs/list',
    refresh: '/api/v1/jobs/refresh',
  },
  health: '/api/v1/health',
  root: '/',
  docs: '/docs',
};
```

## Environment-Specific Settings

### Development
- Timeout: 10 seconds
- Debug info enabled
- Console logging enabled
- Config manager available globally

### Production
- Timeout: 15 seconds
- Debug info disabled
- Optimized performance
- Error tracking enabled

### Staging
- Timeout: 12 seconds
- Limited debug info
- Testing features enabled

## Configuration Validation

The system automatically validates configuration on startup:

```typescript
import { validateAllConfigs } from './src/config';

const errors = validateAllConfigs();
if (errors.length > 0) {
  console.error('Configuration errors:', errors);
}
```

## Troubleshooting

### Common Issues

1. **"Cannot connect to backend server"**
   - Check `VITE_API_BASE_URL` is correct
   - Ensure backend is running
   - Verify CORS settings

2. **"Configuration errors"**
   - Check all required environment variables
   - Validate URL format (must start with http/https)
   - Check timeout values are reasonable

3. **"API timeout"**
   - Increase timeout in `api.config.ts`
   - Check network connectivity
   - Verify backend performance

### Debug Commands

```bash
# Check current configuration
npm run dev
# Then in browser console:
console.log(window.configManager.getCurrentConfig());

# Test API connection
await window.testApi();

# View all available environments
console.log(window.configManager.getAvailableEnvironments());
```

## Best Practices

1. **Environment Variables**
   - Use `.env.local` for local overrides
   - Never commit sensitive data to `.env`
   - Use different URLs for each environment

2. **API URLs**
   - Always use HTTPS in production
   - Include port numbers for local development
   - Test URLs before deployment

3. **Configuration Management**
   - Validate configuration on app startup
   - Provide clear error messages
   - Use environment-specific timeouts

4. **Development**
   - Enable debug mode locally
   - Use config manager for testing
   - Log configuration summary on startup

## Migration from Legacy Config

If upgrading from the old configuration system:

1. Remove old `config.ts` file
2. Update imports to use new config system
3. Move environment variables to new format
4. Test all API endpoints work correctly

The new system provides better type safety, validation, and runtime management compared to the legacy configuration.