import { useState, useEffect } from 'react';
import { config, validateConfig, getGoogleSheetsUrls } from './config';
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

interface Job {
  company: string;
  job_title: string;
  link: string;
}

// No hardcoded values - all configuration comes from environment variables

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Validate configuration on mount
  useEffect(() => {
    const configErrors = validateConfig();
    if (configErrors.length > 0) {
      setError(`Configuration errors: ${configErrors.join(', ')}`);
      setLoading(false);
      return;
    }
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);

    // Try multiple URL formats from configuration
    const urlsToTry = getGoogleSheetsUrls();

    for (let i = 0; i < urlsToTry.length; i++) {
      try {
        console.log(`Trying URL ${i + 1}:`, urlsToTry[i]);

        const response = await fetch(urlsToTry[i], {
          method: 'GET',
          headers: {
            'Accept': 'text/csv,text/plain,*/*'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const csvText = await response.text();
        console.log('CSV Response:', csvText.substring(0, 200) + '...');

        // Check if we got a login page instead of CSV
        if (csvText.includes('accounts.google.com') || csvText.includes('Sign in')) {
          throw new Error('Sheet is not publicly accessible. Please make it public.');
        }

        const rows = csvText.split('\n').slice(1); // Skip header row

        const jobsData: Job[] = rows
          .filter(row => row.trim()) // Filter out empty rows
          .map(row => {
            // Parse CSV row (handle quoted values)
            const columns = row.split(',').map(col => col.replace(/^"|"$/g, '').trim());
            return {
              company: columns[0] || 'Unknown Company',
              job_title: columns[1] || 'Unknown Position',
              link: columns[2] || '#'
            };
          })
          .filter(job => job.company !== 'Unknown Company' && job.job_title !== 'Unknown Position');

        setJobs(jobsData);
        setFilteredJobs(jobsData);
        setLastUpdated(new Date());
        console.log(`Successfully loaded ${jobsData.length} jobs`);
        console.log('Setting loading to false...');
        setLoading(false); // Explicitly set loading to false on success
        return; // Success, exit the loop

      } catch (err) {
        console.error(`URL ${i + 1} failed:`, err);
        if (i === urlsToTry.length - 1) {
          // Last URL failed, set error
          setError(err instanceof Error ? err.message : 'Failed to fetch jobs from all sources');
          setLoading(false); // Set loading to false on final error
        }
      }
    }
  };

  useEffect(() => {
    // Set document title from configuration
    document.title = config.appTitle;
    fetchJobs();
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

  console.log('Current loading state:', loading, 'Jobs count:', jobs.length);

  if (loading) {
    return (
      <div className="loading-container">
        <RefreshIcon size={48} className="loading-spinner" />
        <p>Loading job listings...</p>
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
          <button onClick={fetchJobs} className="refresh-button" disabled={loading}>
            <RefreshIcon size={20} className={loading ? 'loading-spinner' : ''} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="error-container">
            <AlertCircleIcon size={20} />
            <span>Error: {error}</span>
            <button onClick={fetchJobs} className="retry-button">
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