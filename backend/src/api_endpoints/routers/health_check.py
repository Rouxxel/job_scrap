################################################################################
# Health Check Endpoint
##
# @file health_check.py
# @date: 2025
################################################################################
"""
This module defines a health check endpoint to verify API status and configuration.
"""

# Native imports
from typing import Dict, Any
from datetime import datetime

# Third-party imports
from fastapi import APIRouter, Request

# Other files imports
from src.utils.custom_logger import log_handler
from src.utils.limiter import limiter as SlowLimiter
from src.core_specs.configuration.config_loader import config_loader

"""API ROUTER-----------------------------------------------------------"""
router = APIRouter(
    prefix=config_loader['endpoints']['health_check_endpoint']['endpoint_prefix'],
    tags=[config_loader['endpoints']['health_check_endpoint']['endpoint_tag']],
)

"""ENDPOINT-----------------------------------------------------------"""
@router.get(config_loader['endpoints']['health_check_endpoint']['endpoint_route'])
@SlowLimiter.limit(
    f"{config_loader['endpoints']['health_check_endpoint']['request_limit']}/"
    f"{config_loader['endpoints']['health_check_endpoint']['unit_of_time_for_limit']}"
)
async def health_check_endpoint(request: Request) -> Dict[str, Any]:
    """
    Health check endpoint to verify API status and configuration.
    
    Parameters:
        request (Request): The incoming HTTP request for rate limiting.
        
    Returns:
        dict: JSON response with health status and system information
    """
    log_handler.debug("Health check requested")
    
    # Check configuration status
    config_status = {
        "sheet_configured": bool(config_loader['defaults']['doc_id']),
        "sheet_id": config_loader['defaults']['doc_id'][:10] + "..." if config_loader['defaults']['doc_id'] else None,
        "sheet_name": config_loader['defaults']['sheet_1_name']
    }
    
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "Job Scraper Backend API",
        "version": "1.0.0",
        "configuration": config_status,
        "endpoints": {
            "jobs_list": "/api/v1/jobs/list",
            "jobs_refresh": "/api/v1/jobs/refresh",
            "health": "/api/v1/health",
            "docs": "/docs"
        }
    }