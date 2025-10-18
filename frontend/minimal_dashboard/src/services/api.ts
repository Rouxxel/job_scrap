/**
 * API Service for Job Dashboard
 * 
 * Handles all API calls to the backend server using centralized configuration
 */

import { apiConfig, API_ROUTES, REQUEST_CONFIG, getApiUrl } from '../config';

// Types
export interface Job {
  company: string;
  job_title: string;
  link: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  last_updated?: string;
  cached?: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  endpoint?: string;
}

class ApiService {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = apiConfig.baseUrl;
    this.timeout = apiConfig.timeout;
  }

  /**
   * Make HTTP request with error handling and retry logic
   */
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = getApiUrl(endpoint);
    const { retry } = REQUEST_CONFIG;
    
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= retry.attempts; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        
        const response = await fetch(url, {
          headers: {
            ...REQUEST_CONFIG.headers,
            ...options.headers,
          },
          signal: controller.signal,
          ...options,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          const error: ApiError = {
            message: `HTTP ${response.status}: ${errorText}`,
            status: response.status,
            endpoint,
          };
          throw error;
        }

        return await response.json();
        
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on certain errors
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            throw new Error(`Request timeout after ${this.timeout}ms for ${endpoint}`);
          }
          
          // Don't retry on 4xx errors (client errors)
          if ('status' in error && typeof error.status === 'number' && error.status >= 400 && error.status < 500) {
            throw error;
          }
        }
        
        // Wait before retry (with exponential backoff)
        if (attempt < retry.attempts) {
          const delay = retry.delay * Math.pow(retry.backoff, attempt - 1);
          await new Promise(resolve => setTimeout(resolve, delay));
          console.warn(`API request failed for ${endpoint}, retrying in ${delay}ms (attempt ${attempt}/${retry.attempts})`);
        }
      }
    }
    
    console.error(`API request failed for ${endpoint} after ${retry.attempts} attempts:`, lastError);
    throw lastError || new Error(`API request failed after ${retry.attempts} attempts`);
  }

  /**
   * Get job listings from the backend
   */
  async getJobs(): Promise<ApiResponse<Job[]>> {
    return this.makeRequest<ApiResponse<Job[]>>(API_ROUTES.jobs.list);
  }

  /**
   * Refresh job listings (force fetch from Google Sheets)
   */
  async refreshJobs(): Promise<ApiResponse<Job[]>> {
    return this.makeRequest<ApiResponse<Job[]>>(API_ROUTES.jobs.refresh, {
      method: 'POST',
    });
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<any> {
    return this.makeRequest(API_ROUTES.health);
  }

  /**
   * Check if backend is available
   */
  async isBackendAvailable(): Promise<boolean> {
    try {
      await this.healthCheck();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get current API configuration info
   */
  getApiInfo() {
    return {
      baseUrl: this.baseUrl,
      timeout: this.timeout,
      endpoints: API_ROUTES,
    };
  }

  /**
   * Update base URL (useful for switching environments)
   */
  updateBaseUrl(newBaseUrl: string) {
    this.baseUrl = newBaseUrl;
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;