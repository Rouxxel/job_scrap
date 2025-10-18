/**
 * Configuration Validation Utilities
 * 
 * Separate validation functions to avoid circular dependencies
 */

import { validateApiConfig } from './api.config';
import { validateAppConfig, isDevelopment, APP_CONFIG } from './app.config';
import { apiConfig } from './api.config';

// Combined validation function
export const validateAllConfigs = (): string[] => {
  const apiErrors = validateApiConfig();
  const appErrors = validateAppConfig();
  
  return [...apiErrors, ...appErrors];
};

// Environment summary for debugging
export const getConfigSummary = () => ({
  app: {
    title: APP_CONFIG.title,
    version: APP_CONFIG.version,
    environment: isDevelopment() ? 'development' : 'production',
  },
  api: {
    baseUrl: apiConfig.baseUrl,
    timeout: apiConfig.timeout,
  },
  features: APP_CONFIG.features,
  validation: {
    errors: validateAllConfigs(),
    isValid: validateAllConfigs().length === 0,
  },
});