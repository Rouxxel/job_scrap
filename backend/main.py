"""
#############################################################################
### Main backend file
###
### @file main.py
### @author Sebastian Russo
### @date 2025
#############################################################################

This module initializes the FastAPI backend locally for development.
It sets up routers, custom logger, rate limiter, and loads environment variables.
"""

#Native imports
import os
from contextlib import asynccontextmanager

#Third-party imports
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from dotenv import load_dotenv
load_dotenv()

#Other files imports
from src.utils.request_limiter import rate_limit_handler
from src.utils.custom_logger import log_handler
from src.utils.limiter import limiter

#Json files
from src.core_specs.configuration.config_loader import config_loader

#Endpoints imports
from src.api_endpoints.root_endpoint import router as root_router
from src.api_endpoints.routers.jobs_info import jobs_router
from src.api_endpoints.routers.health_check import router as health_router

"""ENVIRONMENT VARIABLES---------------------------------------------------"""
# Google Sheets configuration is loaded via config_loader from .env file

"""API APP-----------------------------------------------------------"""
#Lifespan event manager (startup and shutdown)
@asynccontextmanager
async def lifespan(app: FastAPI):
    port = config_loader["network"]["server_port"]
    log_handler.info(f"Scraps metal server starting on port {port}")
    yield
    log_handler.info("Scraps metal server shutting down")

#Create FastAPI app
app = FastAPI(lifespan=lifespan, title="Job Scraper Backend")

"""MIDDLEWARE-----------------------------------------------------------"""
# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

"""VARIOUS-----------------------------------------------------------"""
#Setup rate limiter
app.state.limiter = limiter

#Add global exception handler for rate limits
app.add_exception_handler(RateLimitExceeded, rate_limit_handler)

"""Routers-----------------------------------------------------------"""
#Root
app.include_router(root_router)
#Jobs
app.include_router(jobs_router)
#Health
app.include_router(health_router)

"""Start server-----------------------------------------------------------"""
if __name__ == "__main__":
    port = config_loader["network"]["server_port"]
    
    uvicorn.run(
        config_loader["network"]["uvicorn_app_reference"],
        host=config_loader["network"]["host"],
        port=config_loader["network"]["server_port"],
        reload=config_loader["network"]["reload"],
        workers=config_loader["network"]["workers"],
        proxy_headers=config_loader["network"]["proxy_headers"]
    )
    
    log_handler.info(f"Server started successfully on port {port}")
    #available at: http://127.0.0.1:3001/docs
