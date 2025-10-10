# Job Scraper

This project contains configuration settings for scraping job listings from multiple websites while respecting their policies and robots.txt rules. The configuration is designed to work with automated scraping tools while remaining compliant with site restrictions.  

In the future, this project may include a **frontend interface** to visualize, filter, and manage job listings more easily.

---

## Table of Contents

1. [Overview](#overview)  
2. [Search Configuration](#search-configuration)  
3. [Sites Configuration](#sites-configuration)  
4. [Restrictions and Compliance](#restrictions-and-compliance)  
5. [Workflow Overview](#workflow-Overview)  
6. [Usage](#usage)  
7. [Notes](#notes)  
8. [Future Improvements](#future-improvements)  

---

## Overview

This configuration enables scraping of job listings from multiple sources such as JobTeaser, Make It in Germany, LinkedIn, Indeed, Glassdoor, Adzuna, StepStone, and Greenhouse. It includes:

- Sitemap or search templates for job discovery  
- CSS selectors for extracting job cards, titles, links, and companies  
- Filters for allowed URLs and job types  
- Compliance rules with terms of service and robots.txt  

The configuration is modular, allowing you to easily add new job sources or modify scraping rules.

---

## Search Configuration

The `search_config` section defines general scraping parameters:

- **maxPagesPerQuery**: Maximum number of pages to scrape per search query (default: 3)  
- **maxLinkExtractor**: Maximum links to extract per page (default: 1)  
- **batchSizeSitemapLinkLoop**: Number of sitemap links processed per batch (default: 25)  
- **batchSizeJobLinkLoop**: Number of job links processed per batch (default: 1)  
- **pageLanguage**: Filter pages by language (default: `/en/`)  
- **linkEtiquetteFilter**: Allowed URL patterns for job links  
- **search_keywords**: Keywords for filtering relevant jobs (e.g., `software`, `developer`, `junior`, `ai`, `data`, `engineer`)  

---

## Sites Configuration

Each site is configured with the following fields:

- **name**: Site identifier  
- **baseUrl**: Main website URL  
- **searchTemplate**: Template or sitemap for finding job listings  
- **robotsTxt**: URL for robots.txt compliance  
- **useRenderer**: Whether to use a renderer for dynamic pages  
- **allowedToScrape**: Indicates if scraping is permitted  
- **note**: Additional information about scraping rules  
- **selectors**: CSS selectors for job cards, titles, links, companies, and locations  
- **policyReferences**: Links to terms of service and robots.txt  
- **restrictions**: Disallowed paths and prohibited activities  
- **headers**: HTTP headers to use during requests  
- **sitemapPattern**: Pattern to identify sitemap entries (optional)  

Examples include JobTeaser and Make It in Germany, which allow scraping via their sitemap, and sites like LinkedIn and Glassdoor, which explicitly forbid scraping.

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

