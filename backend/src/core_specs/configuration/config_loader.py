################################################################################
# Configuration Loader
##
# @file config_loader.py
# @date: 2025
################################################################################
"""
Configuration loader for the Job Scraper Backend.
Loads application settings from JSON configuration files and environment variables.
"""

# Native imports
import os
import json
from typing import Dict, Any

# Third-party imports
from dotenv import load_dotenv

# Other files imports
from src.utils.custom_logger import log_handler

# Load environment variables
load_dotenv()

def load_config() -> Dict[str, Any]:
    """
    Load configuration from JSON file and environment variables.
    
    Returns:
        Dict containing all configuration settings
    """
    try:
        # Get config file path
        config_path = os.path.join(os.path.dirname(__file__), "config_file.json")
        
        # Load JSON configuration
        with open(config_path, 'r', encoding='utf-8') as file:
            config = json.load(file)
        
        # Override with environment variables where applicable
        config['defaults']['doc_id'] = os.getenv('GOOGLE_SHEET_ID', config['defaults']['doc_id'])
        config['defaults']['sheet_1_name'] = os.getenv('GOOGLE_SHEET_NAME', config['defaults']['sheet_1_name'])
        
        # Network configuration from environment
        config['network']['host'] = os.getenv('HOST', config['network']['host'])
        config['network']['server_port'] = int(os.getenv('PORT', config['network']['server_port']))
        
        log_handler.info("Configuration loaded successfully")
        return config
        
    except FileNotFoundError:
        log_handler.error(f"Configuration file not found: {config_path}")
        raise RuntimeError("Configuration file not found")
    except json.JSONDecodeError as e:
        log_handler.error(f"Error parsing JSON configuration: {e}")
        raise RuntimeError("Invalid JSON configuration")
    except Exception as e:
        log_handler.error(f"Error loading configuration: {e}")
        raise RuntimeError("Configuration loading failed")

# Load configuration on module import
config_loader = load_config()