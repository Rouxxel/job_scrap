/**
 * Configuration Tests
 * 
 * Simple tests to verify configuration system works correctly
 */

import { validateAllConfigs, getConfigSummary } from './validation';
import { apiConfig, APP_CONFIG } from './index';

// Test configuration validation
export const testConfiguration = () => {
  console.log('🧪 Testing Configuration System...');
  
  // Test validation
  const errors = validateAllConfigs();
  console.log('Validation errors:', errors);
  
  // Test config summary
  const summary = getConfigSummary();
  console.log('Config summary:', summary);
  
  // Test API config
  console.log('API Config:', {
    baseUrl: apiConfig.baseUrl,
    timeout: apiConfig.timeout,
  });
  
  // Test App config
  console.log('App Config:', {
    title: APP_CONFIG.title,
    version: APP_CONFIG.version,
    features: APP_CONFIG.features,
  });
  
  console.log('✅ Configuration test completed');
  
  return {
    isValid: errors.length === 0,
    errors,
    summary,
  };
};

// Run test in development mode
if (import.meta.env.DEV) {
  // Make test available globally for debugging
  (window as any).testConfig = testConfiguration;
  console.log('🔧 Development mode: testConfig() available globally');
}