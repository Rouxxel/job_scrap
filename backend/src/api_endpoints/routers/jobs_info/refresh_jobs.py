################################################################################
# Refresh Jobs Endpoint
##
# @file refresh_jobs.py
# @date: 2025
################################################################################
"""
This module defines the endpoint to force refresh job listings from Google Sheets.
Bypasses cache and fetches fresh data directly from the source.
"""

# Native imports
from typing import Dict, Any

# Third-party imports
from fastapi import APIRouter, Request, HTTPException

# Other files imports
from src.utils.custom_logger import log_handler
from src.utils.limiter import limiter as SlowLimiter
from src.core_specs.configuration.config_loader import config_loader
from .jobs_utils import fetch_jobs_from_sheets, get_jobs_cache

"""API ROUTER-----------------------------------------------------------"""
router = APIRouter(
    prefix=config_loader['endpoints']['refresh_jobs_endpoint']['endpoint_prefix'],
    tags=[config_loader['endpoints']['refresh_jobs_endpoint']['endpoint_tag']],
)

"""ENDPOINT-----------------------------------------------------------"""
@router.post(config_loader['endpoints']['refresh_jobs_endpoint']['endpoint_route'])
@SlowLimiter.limit(
    f"{config_loader['endpoints']['refresh_jobs_endpoint']['request_limit']}/"
    f"{config_loader['endpoints']['refresh_jobs_endpoint']['unit_of_time_for_limit']}"
)
async def refresh_jobs_endpoint(request: Request) -> Dict[str, Any]:
    """
    Force refresh job listings from Google Sheets, bypassing cache.
    
    This endpoint will always fetch fresh data from Google Sheets,
    regardless of cache status. Use this when you need the most
    up-to-date job listings.
    
    Parameters:
        request (Request): The incoming HTTP request for rate limiting.
        
    Returns:
        dict: JSON response containing fresh job listings and metadata
        
    Raises:
        HTTPException: If there's an error fetching job data
    """
    try:
        log_handler.info("POST /jobs/refresh - Force refreshing job listings")
        
        # Force refresh from Google Sheets
        jobs = await fetch_jobs_from_sheets(force_refresh=True)
        cache = get_jobs_cache()
        
        response_data = {
            "success": True,
            "data": jobs,
            "count": len(jobs),
            "last_updated": cache["last_updated"].isoformat(),
            "cached": False,  # Always false for refresh endpoint
            "message": "Job data refreshed successfully from Google Sheets",
            "cache_duration": cache["cache_duration"]
        }
        
        log_handler.info(f"Successfully refreshed {len(jobs)} jobs from Google Sheets")
        return response_data
        
    except HTTPException:
        # Re-raise HTTP exceptions (they have proper status codes)
        raise
    except Exception as e:
        log_handler.error(f"Unexpected error in refresh_jobs_endpoint: {e}")
        raise HTTPException(status_code=500, detail="Internal server error while refreshing job listings")