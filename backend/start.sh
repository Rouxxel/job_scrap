#!/bin/bash

# Job Scraper Backend Startup Script

echo "🚀 Starting Job Scraper Backend..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create one with your Google Sheets configuration."
    echo "Example:"
    echo "GOOGLE_SHEET_ID=your_sheet_id_here"
    echo "GOOGLE_SHEET_NAME=sheet_1"
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📚 Installing dependencies..."
pip install -r requirements.txt

# Create logs directory
mkdir -p logs

# Start the server
echo "🌟 Starting FastAPI server on http://localhost:3001"
echo "📖 API Documentation: http://localhost:3001/docs"
echo "🔍 Health Check: http://localhost:3001/api/v1/health"
echo ""
python main.py