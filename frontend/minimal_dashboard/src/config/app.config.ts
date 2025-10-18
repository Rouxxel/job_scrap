/**
 * Application Configuration for Job Dashboard
 * 
 * General app settings and configuration
 */

// App metadata
export const APP_CONFIG = {
  // Basic app info
  title: import.meta.env.VITE_APP_TITLE || 'Job Dashboard - Software Engineering Positions',
  description: 'A modern job dashboard displaying software engineering positions',
  version: '1.0.0',
  
  // UI Configuration
  ui: {
    jobsPerPage: parseInt(import.meta.env.VITE_JOBS_PER_PAGE || '50'),
    refreshInterval: parseInt(import.meta.env.VITE_REFRESH_INTERVAL || '300000'), // 5 minutes
    searchDebounceMs: 300,
    animationDuration: 200,
  },
  
  // Feature flags
  features: {
    autoRefresh: import.meta.env.VITE_ENABLE_AUTO_REFRESH === 'true',
    darkMode: import.meta.env.VITE_ENABLE_DARK_MODE === 'true',
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    debugMode: import.meta.env.VITE_DEBUG_MODE === 'true',
  },
  
  // External links
  links: {
    documentation: '/docs',
    support: 'mailto:support@example.com',
    github: 'https://github.com/your-repo/job-scraper',
  },
  
  // Development settings
  development: {
    logLevel: import.meta.env.VITE_LOG_LEVEL || 'info',
    mockData: import.meta.env.VITE_USE_MOCK_DATA === 'true',
    showDebugInfo: import.meta.env.VITE_SHOW_DEBUG_INFO === 'true',
  },
} as const;

// Validation function
export const validateAppConfig = (): string[] => {
  const errors: string[] = [];
  
  if (!APP_CONFIG.title) {
    errors.push('App title is required');
  }
  
  if (APP_CONFIG.ui.jobsPerPage < 1 || APP_CONFIG.ui.jobsPerPage > 1000) {
    errors.push('Jobs per page must be between 1 and 1000');
  }
  
  if (APP_CONFIG.ui.refreshInterval < 10000) {
    errors.push('Refresh interval must be at least 10000ms (10 seconds)');
  }
  
  if (APP_CONFIG.ui.searchDebounceMs < 0 || APP_CONFIG.ui.searchDebounceMs > 2000) {
    errors.push('Search debounce must be between 0 and 2000ms');
  }
  
  return errors;
};

// Helper functions
export const isFeatureEnabled = (feature: keyof typeof APP_CONFIG.features): boolean => {
  return APP_CONFIG.features[feature];
};

export const isDevelopment = (): boolean => {
  return import.meta.env.DEV;
};

export const isProduction = (): boolean => {
  return import.meta.env.PROD;
};