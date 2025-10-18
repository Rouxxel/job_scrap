################################################################################
# Get Jobs List Endpoint
##
# @file get_jobs_list.py
# @date: 2025
################################################################################
"""
This module defines the endpoint to fetch job listings from Google Sheets.
Returns cached data if available and fresh, otherwise fetches new data.
"""

# Native imports
from typing import Dict, Any

# Third-party imports
from fastapi import APIRouter, Request, HTTPException

# Other files imports
from src.utils.custom_logger import log_handler
from src.utils.limiter import limiter as SlowLimiter
from src.core_specs.configuration.config_loader import config_loader
from .jobs_utils import fetch_jobs_from_sheets, get_jobs_cache, is_cache_valid

"""API ROUTER-----------------------------------------------------------"""
router = APIRouter(
    prefix=config_loader['endpoints']['get_jobs_endpoint']['endpoint_prefix'],
    tags=[config_loader['endpoints']['get_jobs_endpoint']['endpoint_tag']],
)

"""ENDPOINT-----------------------------------------------------------"""
@router.get(config_loader['endpoints']['get_jobs_endpoint']['endpoint_route'])
@SlowLimiter.limit(
    f"{config_loader['endpoints']['get_jobs_endpoint']['request_limit']}/"
    f"{config_loader['endpoints']['get_jobs_endpoint']['unit_of_time_for_limit']}"
)
async def get_jobs_list_endpoint(request: Request) -> Dict[str, Any]:
    """
    Fetch job listings from Google Sheets.
    
    Returns cached data if available and fresh, otherwise fetches new data.
    
    Parameters:
        request (Request): The incoming HTTP request for rate limiting.
        
    Returns:
        dict: JSON response containing job listings and metadata
        
    Raises:
        HTTPException: If there's an error fetching job data
    """
    try:
        log_handler.info("GET /jobs/list - Fetching job listings")
        
        jobs = await fetch_jobs_from_sheets(force_refresh=False)
        cache = get_jobs_cache()
        
        response_data = {
            "success": True,
            "data": jobs,
            "count": len(jobs),
            "last_updated": cache["last_updated"].isoformat() if cache["last_updated"] else None,
            "cached": is_cache_valid(),
            "cache_duration": cache["cache_duration"]
        }
        
        log_handler.info(f"Successfully returned {len(jobs)} jobs (cached: {is_cache_valid()})")
        return response_data
        
    except HTTPException:
        # Re-raise HTTP exceptions (they have proper status codes)
        raise
    except Exception as e:
        log_handler.error(f"Unexpected error in get_jobs_list_endpoint: {e}")
        raise HTTPException(status_code=500, detail="Internal server error while fetching job listings")