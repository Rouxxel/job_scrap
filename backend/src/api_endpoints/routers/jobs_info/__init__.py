"""
Jobs Info Router Package

This package contains all job-related API endpoints.
Each endpoint is in its own file for better organization and maintainability.
"""

from fastapi import APIRouter

# Import individual endpoint routers
from .get_jobs_list import router as get_jobs_router
from .refresh_jobs import router as refresh_jobs_router

# Create main jobs router that combines all job endpoints
jobs_router = APIRouter()

# Include individual endpoint routers
jobs_router.include_router(get_jobs_router)
jobs_router.include_router(refresh_jobs_router)

# Export the combined router
__all__ = ["jobs_router"]