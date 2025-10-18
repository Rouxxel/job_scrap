import { useState, useEffect } from 'react';
import { apiService } from './services/api';
import type { Job } from './services/api';
import { APP_CONFIG, validateAllConfigs, getConfigSummary } from './config';
import './App.css';

// Icon component props interface
interface IconProps {
  size?: number;
  className?: string;
}

// Simple SVG icons as components
const SearchIcon = ({ size = 20, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const Building2Icon = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
    <path d="M6 12H4a2 2 0 0 0-2 2v8h20v-8a2 2 0 0 0-2-2h-2"></path>
    <path d="M10 6h4"></path>
    <path d="M10 10h4"></path>
    <path d="M10 14h4"></path>
    <path d="M10 18h4"></path>
  </svg>
);

const ExternalLinkIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15,3 21,3 21,9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);

const RefreshIcon = ({ size = 20, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <polyline points="23,4 23,10 17,10"></polyline>
    <polyline points="1,20 1,14 7,14"></polyline>
    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
  </svg>
);

const AlertCircleIcon = ({ size = 20, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

// Configuration from centralized config system
const config = {
  appTitle: APP_CONFIG.title,
  apiInfo: apiService.getApiInfo(),
};

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [backendAvailable, setBackendAvailable] = useState<boolean | null>(null);


  const fetchJobs = async (forceRefresh: boolean = false) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching jobs from backend API (refresh: ${forceRefresh})`);
      
      // Call appropriate API endpoint
      const response = forceRefresh 
        ? await apiService.refreshJobs()
        : await apiService.getJobs();
      
      if (response.success && response.data) {
        setJobs(response.data);
        setFilteredJobs(response.data);
        setLastUpdated(new Date());
        setBackendAvailable(true);
        
        console.log(`Successfully loaded ${response.data.length} jobs from API`);
        console.log(`Data was ${response.cached ? 'cached' : 'fresh'}`);
      } else {
        throw new Error('Invalid response from API');
      }
      
    } catch (err) {
      console.error('Failed to fetch jobs from API:', err);
      setBackendAvailable(false);
      
      // Provide helpful error messages
      let errorMessage = 'Failed to fetch jobs from backend API';
      
      if (err instanceof Error) {
        if (err.message.includes('fetch') || err.message.includes('timeout')) {
          errorMessage = `Cannot connect to backend server. Please ensure the backend is running on ${config.apiInfo.baseUrl}`;
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Check configuration and backend availability on mount
  useEffect(() => {
    const initializeApp = async () => {
      // Validate configuration
      const errors = validateAllConfigs();
      
      if (errors.length > 0) {
        setLoading(false);
        setError(`Configuration errors: ${errors.join(', ')}`);
        return;
      }
      
      // Check backend availability
      const available = await apiService.isBackendAvailable();
      setBackendAvailable(available);
      
      if (available) {
        fetchJobs();
      } else {
        setLoading(false);
        setError(`Backend server is not available at ${config.apiInfo.baseUrl}. Please start the backend server.`);
      }
    };

    // Set document title
    document.title = config.appTitle;
    
    // Log configuration summary in development
    if (APP_CONFIG.development.showDebugInfo) {
      console.log('App Configuration:', getConfigSummary());
      
      // Import and run config test in development
      import('./config/config.test').then(({ testConfiguration }) => {
        testConfiguration();
      });
    }
    
    initializeApp();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter(job =>
        job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredJobs(filtered);
    }
  }, [searchTerm, jobs]);

  const handleJobClick = (link: string) => {
    if (link && link !== '#') {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  const handleRefresh = () => {
    fetchJobs(true); // Force refresh
  };

  const getCompanyInitials = (company: string) => {
    return company
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatJobTitle = (title: string) => {
    // Capitalize first letter of each word
    return title
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <RefreshIcon size={48} className="loading-spinner" />
        <p>Loading job listings...</p>
        {backendAvailable === false && (
          <p className="loading-subtitle">Checking backend connection...</p>
        )}
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1 className="header-title">
            <Building2Icon className="header-icon" />
            {config.appTitle}
          </h1>
          <div className="header-stats">
            <span className="job-count">{filteredJobs.length} jobs found</span>
            {lastUpdated && (
              <span className="last-updated">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            {backendAvailable !== null && (
              <span className={`backend-status ${backendAvailable ? 'online' : 'offline'}`}>
                Backend: {backendAvailable ? 'Online' : 'Offline'}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="main">
        <div className="search-container">
          <div className="search-box">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search jobs by title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button 
            onClick={handleRefresh} 
            className="refresh-button" 
            disabled={loading || !backendAvailable}
            title={backendAvailable ? "Refresh job data" : "Backend unavailable"}
          >
            <RefreshIcon size={20} className={loading ? 'loading-spinner' : ''} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="error-container">
            <AlertCircleIcon size={20} />
            <span>Error: {error}</span>
            {backendAvailable === false && (
              <div className="error-help">
                <p>Make sure the backend server is running:</p>
                <code>cd backend && python main.py</code>
              </div>
            )}
            <button onClick={() => fetchJobs()} className="retry-button" disabled={!backendAvailable}>
              Retry
            </button>
          </div>
        )}

        <div className="jobs-grid">
          {filteredJobs.map((job, index) => (
            <div
              key={index}
              className="job-card"
              onClick={() => handleJobClick(job.link)}
            >
              <div className="job-card-header">
                <div className="company-avatar">
                  {getCompanyInitials(job.company)}
                </div>
                <div className="job-info">
                  <h3 className="job-title">{formatJobTitle(job.job_title)}</h3>
                  <p className="company-name">
                    <Building2Icon size={16} />
                    {job.company}
                  </p>
                </div>
              </div>
              
              <div className="job-card-footer">
                <div className="job-actions">
                  <ExternalLinkIcon size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && !loading && !error && (
          <div className="no-results">
            <AlertCircleIcon size={48} />
            <h3>No jobs found</h3>
            <p>Try adjusting your search terms or refresh the data.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;