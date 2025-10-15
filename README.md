# n8n Job Scraper & Aggregator

An intelligent job scraping and aggregation system built with n8n that collects software engineering positions from multiple sources while respecting website policies and terms of service. The system combines direct scraping for compliant sites with semantic search for restricted platforms.

**🎯 Specialized for Software Engineering Roles**: Backend, Frontend, Fullstack, DevOps, AI/ML, Embedded Systems, and more.

---

## Table of Contents

1. [Project Overview](#project-overview)  
2. [Current Status](#current-status)
3. [Architecture](#architecture)
4. [Search Configuration](#search-configuration)  
5. [Sites Configuration](#sites-configuration)  
6. [Data Pipeline](#data-pipeline)
7. [Google Sheets Integration](#google-sheets-integration)
8. [Compliance & Ethics](#compliance--ethics)
9. [Setup & Usage](#setup--usage)  
10. [Known Issues](#known-issues)
11. [Future Roadmap](#future-roadmap)  

---

## Project Overview

This n8n-powered automation system intelligently aggregates software engineering job listings from multiple sources using a hybrid approach:

- **Direct Scraping**: For sites that explicitly allow it (JobTeaser)
- **Semantic Search**: For restricted sites using Google Custom Search Engine
- **Smart Filtering**: Advanced keyword matching and ban filters for relevant positions
- **Duplicate Prevention**: Intelligent deduplication based on job URLs
- **Google Sheets Export**: Automated data export with duplicate checking

### Key Features

- 🔍 **50+ Technical Keywords**: Targets specific roles from "backend developer" to "machine learning engineer"
- 🚫 **Comprehensive Ban Filter**: Excludes internships, non-technical roles, and business positions  
- 📊 **Google Sheets Integration**: Automatic export with duplicate prevention
- ⚖️ **Ethical Compliance**: Respects robots.txt and terms of service
- 🔄 **Automated Workflow**: Scheduled execution with error handling

---

## Current Status

### ✅ Working Sources
- **JobTeaser**: ✅ Fully functional - Direct sitemap scraping with reliable job link extraction
- **GitHub Jobs**: ✅ API-based integration (free JSON endpoint)
- **RemoteOK**: ✅ API-based integration for remote positions

### ⚠️ Limited/Experimental Sources  
- **Make It in Germany**: ⚠️ **Policy changes detected** - May require updates to scraping approach
- **Google CSE Integration**: ⚠️ Limited by API quotas (100 calls/day free tier)

### 🚫 Restricted Sources (Semantic Search Planned)
- **LinkedIn**: Requires semantic search implementation
- **Indeed**: Requires semantic search implementation  
- **Glassdoor**: Requires semantic search implementation
- **StepStone**: Requires semantic search implementation

---

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   n8n Workflow │────│  Site Configs    │────│  Google Sheets  │
│                 │    │                  │    │                 │
│ ┌─────────────┐ │    │ ┌──────────────┐ │    │ ┌─────────────┐ │
│ │ Schedulers  │ │    │ │ Scrape Rules │ │    │ │ Dedupe Logic│ │
│ │ HTTP Nodes  │ │────│ │ Ban Filters  │ │────│ │ Export Data │ │
│ │ Processors  │ │    │ │ Keywords     │ │    │ │ Track Changes│ │
│ └─────────────┘ │    │ └──────────────┘ │    │ └─────────────┘ │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Project Structure
```
├── n8n/
│   ├── workflow/
│   │   └── scraps_metal_v2.json     # Main n8n workflow
│   └── configuration/
│       └── site_config.json         # Site configurations & filters
├── scripts/                         # Utility scripts (future)
├── frontend/                        # Frontend interface (planned)
└── README.md                        # This file
```

---

## Search Configuration

### Technical Keywords (50+ Specialized Terms)
```json
"search_keywords": [
  "software engineer", "backend developer", "frontend developer",
  "fullstack developer", "python developer", "java developer",
  "devops engineer", "machine learning engineer", "ai engineer",
  "embedded systems engineer", "cloud engineer", "security engineer",
  // ... and 40+ more specific technical roles
]
```

### Ban Filter (Comprehensive Exclusions)
```json
"ban_filter": [
  "intern", "internship", "student", "trainee",
  "sales", "marketing", "business analyst", "project manager",
  "hr", "human resources", "customer service", "administrative",
  // ... and 40+ more non-technical roles
]
```

### Processing Parameters
- **maxPagesPerQuery**: 3 pages per search query
- **batchSizeLoop**: 1 item per batch for controlled processing  
- **pageLanguage**: English pages only (`/en/`)
- **linkEtiquetteFilter**: 30+ job URL patterns for accurate detection

---

## Sites Configuration

### Configuration Schema
Each site includes:
- **Compliance Status**: `allowedToScrape` boolean flag
- **Access Method**: Sitemap, API, or semantic search approach
- **Headers & Authentication**: Required request headers
- **Restrictions**: Disallowed paths and prohibited activities
- **Selectors**: CSS selectors for data extraction (when applicable)
- **Alternative Access**: API documentation and partner program links

### Site Categories

**🟢 Direct Scraping Allowed**
- JobTeaser: Sitemap-based extraction via `job_ads_sitemap`
- GitHub Jobs: JSON API endpoint
- RemoteOK: JSON API for remote positions

**🟡 Limited/Changing Policies**  
- Make It in Germany: Government portal with evolving scraping policies

**🔴 Semantic Search Required**
- LinkedIn, Indeed, Glassdoor: Require Google CSE or similar approaches

---

## Restrictions and Compliance

- Always respect the site’s **robots.txt** and **terms of service**.  
- Avoid scraping personal applicant data or high-volume commercial scraping without permission.  
- Only scrape pages that are publicly available and allowed per the site configuration.  

---

## Workflow Overview

This n8n workflow automates the entire job scraping pipeline:

- **Schedule Trigger:** Executes every 5 hours to fetch new jobs.

- **Configuration Setup:** Loads site-specific configurations including scraping rules, headers, allowed URLs, and keywords.

- **Conditional Checks:** Ensures scraping only occurs for allowed sites.

- **Sitemap and Page Fetching:** Retrieves sitemap XMLs or HTML pages using HTTP requests.

- **Extraction Nodes:**
  - Converts XML to JSON
  - Extracts job links and titles
  - Filters by keyword and language

- **Normalization and Merging:** Deduplicates, normalizes, and merges listings from multiple sources.

- **Custom JavaScript Logic:** Handles advanced parsing and extraction, including company name heuristics and URL-based job title extraction.
---

## Usage

1. Load this configuration into your scraping tool (e.g., n8n or a custom crawler).  
2. Ensure you respect `allowedToScrape` and `restrictions` for each site.  
3. Use the `search_keywords` to filter job listings.  
4. The scraper will extract JSON data containing:

```json
{
    "company": "Company Name",
    "job_title": "Job Title",
    "link": "Job URL"
}
```
5. Merge and normalize data from multiple sources if needed.  
   - Ensure all job entries follow a consistent structure.  
   - Handle cases where some sources may have different field names, e.g., `title` vs `job_title`.  
   - Deduplicate entries by URL to avoid repeats.  

6. Optional: Export results to a cloud spreadsheet (Google Sheets, Airtable, or similar) for easy access and collaboration.  

---

## Notes

- LinkedIn, Indeed, Glassdoor, Adzuna, StepStone, and Greenhouse require official API or partner access; scraping these without permission is prohibited.  
- JobTeaser and Make It in Germany allow scraping of public job pages via sitemaps.  
- You can extend this configuration by adding new sites with their respective selectors and rules.  
- Always respect rate limits and avoid high-volume scraping that could disrupt services.  

---

## Future Improvements

- Add a **frontend interface** for viewing, searching, and filtering job listings.  
- Real-time updates and notifications for new job postings.  
- Enhanced normalization for merged job data from multiple sources.  
- Integration with cloud storage or databases for collaborative access and historical tracking.  
- Optional analytics and visualization tools to track trends in job postings.  
- For sites where scraping is not allowed, implement a **semantic search** using Google Custom Search Engine (CSE) or similar services.  
  This would mimic the natural flow a user would take to reach job postings without directly scraping the site, thereby respecting the site's terms of service.  
  **Limitations:**  
  - Results depend on the search engine’s indexing and may not be exhaustive or real-time.  
  - API usage limits may restrict the number of queries.  
  - Control over the exact format and structure of returned job listings is reduced compared to direct scraping. 

---


## Data Pipeline

### n8n Workflow Components

**1. Configuration & Initialization**
- `sites_config`: Loads site configurations and filtering rules
- `segregated`: Separates allowed vs restricted sites
- `search_maker`: Generates search URLs and parameters

**2. Data Extraction**
- `Request sitemap`: Fetches XML sitemaps with enhanced error handling
- `XML to JSON`: Converts sitemap data to processable format
- `job_sitemap_extractor`: Extracts job-specific sitemap URLs
- `link_extractor`: Parses job links from HTML/XML content

**3. Processing & Filtering**
- `organizer`: Normalizes and structures job data
- `filter_duplicates`: Removes duplicate entries based on job URLs
- `keyword_filter`: Applies technical keyword matching
- `ban_filter`: Excludes non-technical and internship positions

**4. Export & Storage**
- `google_sheets_writer`: Exports to Google Sheets with duplicate prevention
- Error handling and retry logic for network issues

### Data Flow
```
Trigger → Config → Site Selection → HTTP Requests → XML/JSON Processing 
    ↓
Link Extraction → Job Data Normalization → Filtering & Deduplication
    ↓  
Google Sheets Export ← Duplicate Check ← Final Job List
```

---

## Google Sheets Integration

### Features
- **Automatic Duplicate Prevention**: Checks existing job URLs before adding new entries
- **Structured Data Export**: Consistent format with company, job_title, and link columns
- **Batch Processing**: Efficient handling of multiple job entries
- **Error Recovery**: Continues processing even if individual jobs fail

### Data Format
```json
{
  "company": "Netflix",
  "job_title": "Senior Backend Engineer", 
  "link": "https://www.jobteaser.com/en/job-offers/..."
}
```

---

## Compliance & Ethics

### Ethical Scraping Principles
- ✅ **Robots.txt Compliance**: Always check and respect robots.txt directives
- ✅ **Terms of Service**: Only scrape sites that explicitly allow it
- ✅ **Rate Limiting**: Implement delays and retry logic to avoid overwhelming servers
- ✅ **Public Data Only**: Extract only publicly available job listings
- ❌ **No Personal Data**: Never scrape applicant information or private data

### Site-Specific Policies

**🟢 Allowed (Direct Scraping)**
- JobTeaser: Explicitly allows sitemap crawling per robots.txt
- GitHub Jobs: Provides public API for job data
- RemoteOK: Offers public API access

**🟡 Monitoring Required**
- Make It in Germany: Government site with evolving policies - **requires regular compliance checks**

**🔴 Restricted (Semantic Search Only)**
- LinkedIn, Indeed, Glassdoor: Prohibit automated scraping in ToS
- Future implementation will use semantic search to simulate natural user behavior

---

## Setup & Usage

### Prerequisites
- n8n instance (self-hosted or cloud)
- Google Sheets API access (for data export)
- Google Custom Search Engine (for semantic search - optional)

### Installation
1. **Import n8n Workflow**:
   ```bash
   # Import the workflow file
   n8n import:workflow --file=n8n/workflow/scraps_metal_v2.json
   ```

2. **Configure Google Sheets**:
   - Create Google Sheets API credentials
   - Add credentials to n8n Google Sheets nodes
   - Update sheet ID in workflow configuration

3. **Set Up Scheduling**:
   - Configure trigger node for desired frequency
   - Recommended: Every 6-12 hours to respect rate limits

### Running the Workflow
1. **Manual Execution**: Test individual nodes and data flow
2. **Scheduled Runs**: Automated execution based on trigger configuration  
3. **Monitor Results**: Check Google Sheets for new job entries
4. **Review Logs**: Monitor n8n execution logs for errors or issues

### Output Data Structure
```json
[
  {
    "company": "Kearney",
    "job_title": "Senior Software Engineer",
    "link": "https://www.jobteaser.com/en/job-offers/...",
    "website": "jobteaser",
    "source": "direct_scraping"
  }
]
```

---

## Known Issues

### Current Limitations
- **JobTeaser**: ✅ **Fully Reliable** - Only source with consistent job link extraction
- **Make It in Germany**: ⚠️ **Policy changes detected** - Site may be updating their scraping policies. Monitor robots.txt and terms of service for changes.
- **Google CSE Quotas**: Limited to 100 free searches per day, which restricts semantic search capabilities
- **Rate Limiting**: Some sites may temporarily block requests during high-volume operations

### Troubleshooting
- **Socket Hang Up Errors**: Implemented enhanced HTTP request configuration with timeouts and retries
- **Duplicate Detection**: Google Sheets integration includes robust duplicate checking based on job URLs
- **Missing Job Data**: Ban filter may be too aggressive - review and adjust keywords as needed

---

## Future Roadmap

### Phase 1: Enhanced Compliance (In Progress)
- ✅ **JobTeaser Integration**: Fully functional with reliable job extraction
- 🔄 **Make It in Germany Monitoring**: Regular policy compliance checks
- 🔄 **Error Handling**: Enhanced retry logic and timeout management

### Phase 2: Semantic Search Implementation (Planned)
For platforms that don't allow direct scraping, we will implement **semantic search** that simulates the natural flow a user would take to discover job postings:

- 🔮 **LinkedIn Semantic Search**: Google CSE-based job discovery that mimics natural user browsing patterns
- 🔮 **Indeed Integration**: Semantic search approach respecting their terms of service
- 🔮 **Glassdoor Integration**: User-flow simulation for compliant job discovery
- 🔮 **Alternative APIs**: Integration with official job board APIs where available

**Semantic Search Benefits:**
- Respects website terms of service by simulating human behavior
- Uses search engines rather than direct scraping
- Maintains compliance while accessing job market data
- Provides broader coverage of restricted platforms

### Phase 3: Advanced Features (Future)
- 🔮 **Frontend Interface**: Web dashboard for viewing, searching, and filtering job listings
- 🔮 **Real-time Notifications**: Instant alerts for new matching positions
- 🔮 **Analytics Dashboard**: Job market trends and salary insights
- 🔮 **Database Integration**: PostgreSQL/MongoDB for advanced querying and historical data
- 🔮 **Machine Learning**: Job relevance scoring and personalized recommendations

### Phase 4: Scalability & Enterprise (Future)
- 🔮 **Multi-tenant Support**: Support for multiple users and organizations
- 🔮 **API Development**: RESTful API for third-party integrations
- 🔮 **Advanced Filtering**: Location-based search, salary ranges, company size filters
- 🔮 **Compliance Automation**: Automated robots.txt monitoring and policy change detection

---

## Contributing

### Development Guidelines
- Respect all website terms of service and robots.txt files
- Test thoroughly before deploying changes to production
- Document any new site integrations or configuration changes
- Follow ethical scraping practices and rate limiting

### Adding New Job Sources
1. Check robots.txt and terms of service for scraping permissions
2. Add site configuration to `n8n/configuration/site_config.json`
3. Test extraction logic with small data samples
4. Implement appropriate error handling and rate limiting
5. Update documentation and compliance notes

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This tool is designed for educational and personal use. Users are responsible for ensuring compliance with all applicable terms of service, robots.txt files, and local laws. The authors are not responsible for any misuse of this software.