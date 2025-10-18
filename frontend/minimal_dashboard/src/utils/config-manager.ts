/**
 * Configuration Management Utility
 * 
 * Provides runtime configuration management and environment switching
 */

import apiService from '../services/api';
import { API_ENDPOINTS } from '../config';

export class ConfigManager {
  private static instance: ConfigManager;
  
  private constructor() {}
  
  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }
  
  /**
   * Switch to a different environment
   */
  switchEnvironment(environment: keyof typeof API_ENDPOINTS) {
    const config = API_ENDPOINTS[environment];
    if (!config) {
      throw new Error(`Unknown environment: ${environment}`);
    }
    
    apiService.updateBaseUrl(config.baseUrl);
    console.log(`Switched to ${environment} environment: ${config.baseUrl}`);
  }
  
  /**
   * Update API base URL directly
   */
  updateApiUrl(baseUrl: string) {
    if (!baseUrl.startsWith('http')) {
      throw new Error('API URL must start with http:// or https://');
    }
    
    apiService.updateBaseUrl(baseUrl);
    console.log(`Updated API URL to: ${baseUrl}`);
  }
  
  /**
   * Get current configuration
   */
  getCurrentConfig() {
    return apiService.getApiInfo();
  }
  
  /**
   * Test connection to current API
   */
  async testConnection(): Promise<boolean> {
    try {
      await apiService.healthCheck();
      return true;
    } catch {
      return false;
    }
  }
  
  /**
   * Get available environments
   */
  getAvailableEnvironments() {
    return Object.keys(API_ENDPOINTS);
  }
}

// Export singleton instance
export const configManager = ConfigManager.getInstance();

// Development helper functions (only available in development)
if (import.meta.env.DEV) {
  // Make config manager available globally for debugging
  (window as any).configManager = configManager;
  
  // Add console commands for easy environment switching
  (window as any).switchToLocal = () => configManager.switchEnvironment('development');
  (window as any).switchToProduction = () => configManager.switchEnvironment('production');
  (window as any).switchToStaging = () => configManager.switchEnvironment('staging');
  (window as any).testApi = () => configManager.testConnection();
  
  console.log('🔧 Development mode: Config manager available globally');
  console.log('📝 Available commands: switchToLocal(), switchToProduction(), switchToStaging(), testApi()');
}