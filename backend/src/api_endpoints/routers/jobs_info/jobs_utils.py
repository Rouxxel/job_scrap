################################################################################
# Jobs Utilities
##
# @file jobs_utils.py
# @date: 2025
################################################################################
"""
Shared utilities for job-related endpoints.
Contains common functions for Google Sheets integration and caching.
"""

# Native imports
from typing import Dict, Any, List
from datetime import datetime

# Third-party imports
from fastapi import HTTPException
import requests

# Other files imports
from src.utils.custom_logger import log_handler
from src.core_specs.configuration.config_loader import config_loader

"""CACHE MANAGEMENT-----------------------------------------------------------"""
# Cache for job data (shared across endpoints)
_jobs_cache = {
    "data": [],
    "last_updated": None,
    "cache_duration": 300  # 5 minutes in seconds
}

def get_jobs_cache() -> Dict[str, Any]:
    """Get the current jobs cache."""
    return _jobs_cache

def is_cache_valid() -> bool:
    """Check if the current cache is still valid."""
    if not _jobs_cache["last_updated"]:
        return False
    
    cache_age = datetime.now() - _jobs_cache["last_updated"]
    return cache_age.total_seconds() < _jobs_cache["cache_duration"]

def update_cache(jobs: List[Dict[str, str]]) -> None:
    """Update the jobs cache with new data."""
    _jobs_cache["data"] = jobs
    _jobs_cache["last_updated"] = datetime.now()

"""GOOGLE SHEETS INTEGRATION-----------------------------------------------------------"""
def get_google_sheets_urls(sheet_id: str, sheet_name: str) -> List[str]:
    """
    Generate multiple Google Sheets CSV export URLs to try.
    
    Args:
        sheet_id: Google Sheets document ID
        sheet_name: Sheet name/tab name
        
    Returns:
        List of URLs to try for CSV export
    """
    base_url = f"https://docs.google.com/spreadsheets/d/{sheet_id}"
    
    return [
        f"{base_url}/export?format=csv&gid=0",  # First sheet by GID
        f"{base_url}/export?format=csv",  # Default export
        f"{base_url}/gviz/tq?tqx=out:csv&sheet={sheet_name}",  # Query format
        f"{base_url}/gviz/tq?tqx=out:csv",  # Query format without sheet name
    ]

def parse_csv_to_jobs(csv_text: str) -> List[Dict[str, str]]:
    """
    Parse CSV text into job objects.
    
    Args:
        csv_text: Raw CSV text from Google Sheets
        
    Returns:
        List of job dictionaries
    """
    try:
        rows = csv_text.strip().split('\n')
        if len(rows) < 2:  # Need at least header + 1 data row
            return []
        
        # Skip header row
        data_rows = rows[1:]
        
        jobs = []
        for row in data_rows:
            if not row.strip():  # Skip empty rows
                continue
                
            # Parse CSV row (handle quoted values)
            columns = []
            current_col = ""
            in_quotes = False
            
            for char in row:
                if char == '"':
                    in_quotes = not in_quotes
                elif char == ',' and not in_quotes:
                    columns.append(current_col.strip().strip('"'))
                    current_col = ""
                else:
                    current_col += char
            
            # Add the last column
            columns.append(current_col.strip().strip('"'))
            
            # Ensure we have at least 3 columns
            while len(columns) < 3:
                columns.append("")
            
            # Create job object
            job = {
                "company": columns[0] or "Unknown Company",
                "job_title": columns[1] or "Unknown Position", 
                "link": columns[2] or "#"
            }
            
            # Only add jobs with valid data
            if job["company"] != "Unknown Company" and job["job_title"] != "Unknown Position":
                jobs.append(job)
        
        return jobs
        
    except Exception as e:
        log_handler.error(f"Error parsing CSV: {e}")
        return []

async def fetch_jobs_from_sheets(force_refresh: bool = False) -> List[Dict[str, str]]:
    """
    Fetch jobs from Google Sheets with caching.
    
    Args:
        force_refresh: If True, bypass cache and fetch fresh data
        
    Returns:
        List of job dictionaries
    """
    # Return cached data if valid and not forcing refresh
    if not force_refresh and is_cache_valid():
        log_handler.info("Returning cached job data")
        return _jobs_cache["data"]
    
    # Get configuration
    sheet_id = config_loader['defaults']['doc_id']
    sheet_name = config_loader['defaults']['job_sheet_name']
    
    if not sheet_id:
        raise HTTPException(status_code=500, detail="Google Sheet ID not configured")
    
    # Try multiple URL formats
    urls_to_try = get_google_sheets_urls(sheet_id, sheet_name)
    
    for i, url in enumerate(urls_to_try):
        try:
            log_handler.info(f"Trying Google Sheets URL {i + 1}: {url}")
            
            response = requests.get(url, headers={
                'Accept': 'text/csv,text/plain,*/*',
                'User-Agent': 'Job-Scraper-Backend/1.0'
            }, timeout=10)
            
            if not response.ok:
                log_handler.warning(f"URL {i + 1} failed with status {response.status_code}")
                continue
            
            csv_text = response.text
            
            # Check if we got a login page instead of CSV
            if 'accounts.google.com' in csv_text or 'Sign in' in csv_text:
                log_handler.warning(f"URL {i + 1} returned login page - sheet not public")
                continue
            
            # Parse CSV data
            jobs = parse_csv_to_jobs(csv_text)
            
            if jobs:
                # Update cache
                update_cache(jobs)
                
                log_handler.info(f"Successfully fetched {len(jobs)} jobs from Google Sheets")
                return jobs
            else:
                log_handler.warning(f"URL {i + 1} returned no valid job data")
                
        except requests.RequestException as e:
            log_handler.error(f"Request failed for URL {i + 1}: {e}")
            continue
        except Exception as e:
            log_handler.error(f"Unexpected error for URL {i + 1}: {e}")
            continue
    
    # If we get here, all URLs failed
    raise HTTPException(
        status_code=503, 
        detail="Unable to fetch job data from Google Sheets. Please check sheet configuration and accessibility."
    )