// Application configuration from environment variables

export const config = {
  // Google Sheets Configuration
  sheetId: import.meta.env.VITE_SHEET_ID || '1cXb9E8SRLSZtvHrQfuuY6RPuAfaH0AQBmMsGK7rZxn4',
  sheetName: import.meta.env.VITE_SHEET_NAME || 'sheet_1',
  
  // App Configuration
  appTitle: import.meta.env.VITE_APP_TITLE || 'Job Dashboard',
  jobsPerPage: parseInt(import.meta.env.VITE_JOBS_PER_PAGE || '50'),
  refreshInterval: parseInt(import.meta.env.VITE_REFRESH_INTERVAL || '300000'), // 5 minutes
  
  // Optional API Configuration
  googleApiKey: import.meta.env.VITE_GOOGLE_API_KEY || null,
  
  // Development flags
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;

// Validation function
export const validateConfig = (): string[] => {
  const errors: string[] = [];
  
  if (!config.sheetId) {
    errors.push('VITE_SHEET_ID is required');
  }
  
  if (!config.sheetName) {
    errors.push('VITE_SHEET_NAME is required');
  }
  
  if (config.jobsPerPage < 1 || config.jobsPerPage > 1000) {
    errors.push('VITE_JOBS_PER_PAGE must be between 1 and 1000');
  }
  
  if (config.refreshInterval < 10000) {
    errors.push('VITE_REFRESH_INTERVAL must be at least 10000ms (10 seconds)');
  }
  
  return errors;
};

// Generate Google Sheets URLs
export const getGoogleSheetsUrls = () => {
  return [
    `https://docs.google.com/spreadsheets/d/${config.sheetId}/export?format=csv&gid=0`,
    `https://docs.google.com/spreadsheets/d/${config.sheetId}/gviz/tq?tqx=out:csv&sheet=${config.sheetName}`,
    `https://docs.google.com/spreadsheets/d/${config.sheetId}/export?format=csv&gid=0&single=true&output=csv`
  ];
};