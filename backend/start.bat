@echo off
REM Job Scraper Backend Startup Script for Windows

echo 🚀 Starting Job Scraper Backend...

REM Check if .env file exists
if not exist .env (
    echo ❌ .env file not found. Please create one with your Google Sheets configuration.
    echo Example:
    echo GOOGLE_SHEET_ID=your_sheet_id_here
    echo GOOGLE_SHEET_NAME=job_sheet
    pause
    exit /b 1
)

REM Check if virtual environment exists
if not exist venv (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo 📚 Installing dependencies...
pip install -r requirements.txt

REM Create logs directory
if not exist logs mkdir logs

REM Start the server
echo 🌟 Starting FastAPI server on http://localhost:3001
echo 📖 API Documentation: http://localhost:3001/docs
echo 🔍 Health Check: http://localhost:3001/api/v1/health
echo.
python main.py

pause