/**
 * API Configuration for Job Dashboard
 * 
 * Centralized configuration for all API endpoints and settings.
 * Update these URLs when deploying to different environments.
 */

// Environment-based configuration
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// API Base URLs for different environments
export const API_ENDPOINTS = {
    // Development (local backend)
    development: {
        baseUrl: 'http://localhost:3001',
        timeout: 10000, // 10 seconds
    },

    // Production (update these when deploying)
    production: {
        baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://your-backend-on-render.com',
        timeout: 15000, // 15 seconds for production
    },

    // Staging (optional)
    staging: {
        baseUrl: import.meta.env.VITE_STAGING_API_URL || 'https://staging-backend.com',
        timeout: 12000,
    }
} as const;

// Current environment configuration
export const getCurrentApiConfig = () => {
    // Check for explicit environment override
    const envOverride = import.meta.env.VITE_ENVIRONMENT as keyof typeof API_ENDPOINTS;
    if (envOverride && API_ENDPOINTS[envOverride]) {
        return API_ENDPOINTS[envOverride];
    }

    // Default based on build mode
    if (isProduction) {
        return API_ENDPOINTS.production;
    }

    return API_ENDPOINTS.development;
};

// API Endpoints structure
export const API_ROUTES = {
    // Jobs endpoints
    jobs: {
        list: '/api/v1/jobs/list',
        refresh: '/api/v1/jobs/refresh',
    },

    // Health check
    health: '/api/v1/health',

    // Root
    root: '/',

    // Documentation
    docs: '/docs',
    redoc: '/redoc',
} as const;

// Request configuration
export const REQUEST_CONFIG = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },

    // Retry configuration
    retry: {
        attempts: 3,
        delay: 1000, // 1 second
        backoff: 2, // Exponential backoff multiplier
    },

    // Cache configuration
    cache: {
        defaultTTL: 300000, // 5 minutes
        maxAge: 600000, // 10 minutes
    },
} as const;

// Export current configuration
export const apiConfig = getCurrentApiConfig();

// Validation function
export const validateApiConfig = (): string[] => {
    const errors: string[] = [];
    const config = getCurrentApiConfig();

    if (!config.baseUrl) {
        errors.push('API base URL is not configured');
    }

    if (!config.baseUrl.startsWith('http')) {
        errors.push('API base URL must start with http:// or https://');
    }

    if (config.timeout < 1000) {
        errors.push('API timeout must be at least 1000ms');
    }

    return errors;
};

// Helper to get full URL
export const getApiUrl = (endpoint: string): string => {
    const config = getCurrentApiConfig();
    return `${config.baseUrl}${endpoint}`;
};

// Environment info for debugging
export const getEnvironmentInfo = () => ({
    isDevelopment,
    isProduction,
    currentConfig: getCurrentApiConfig(),
    environment: import.meta.env.VITE_ENVIRONMENT || (isProduction ? 'production' : 'development'),
    buildMode: import.meta.env.MODE,
});