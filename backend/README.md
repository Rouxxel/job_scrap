# Job Scraper Backend

This is the FastAPI backend for the job scraper and dashboard system. It provides REST API endpoints to fetch job data from Google Sheets and serve it to the frontend dashboard.

## Features

- **REST API**: FastAPI-based API with automatic documentation
- **Google Sheets Integration**: Fetches job data directly from Google Sheets
- **Caching**: Built-in caching to reduce API calls and improve performance
- **Rate Limiting**: Configurable rate limiting to prevent abuse
- **CORS Support**: Configured for frontend integration
- **Health Checks**: Endpoint to verify API status and configuration

## Setup Instructions

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables**:
   Edit `.env` file with your Google Sheet details:
   ```env
   GOOGLE_SHEET_ID=your_google_sheet_id_here
   GOOGLE_SHEET_NAME=your_sheet_name_here
   ```

4. **Start the server**:
   
   **Option A: Direct Python**
   ```bash
   python main.py
   ```
   
   **Option B: Using startup scripts**
   ```bash
   # Linux/macOS
   chmod +x start.sh
   ./start.sh
   
   # Windows
   start.bat
   ```

The API will be available at `http://localhost:3001`

### API Documentation

Once the server is running, visit:
- **Interactive API docs**: http://localhost:3001/docs
- **Alternative docs**: http://localhost:3001/redoc

## API Endpoints

### Jobs
- `GET /api/v1/jobs/list` - Get job listings (cached)
  - **Rate limit**: 30 requests per minute
  - **Response**: JSON with job data, count, and cache status
  - **Cache**: 5 minutes (300 seconds)

- `POST /api/v1/jobs/refresh` - Force refresh job data from Google Sheets
  - **Rate limit**: 10 requests per minute
  - **Response**: JSON with fresh job data
  - **Note**: Bypasses cache and fetches directly from Google Sheets

### Health & Monitoring
- `GET /api/v1/health` - Health check and configuration status
  - **Rate limit**: 100 requests per minute
  - **Response**: System status, configuration info, and available endpoints

### Root
- `GET /` - Root endpoint (redirects to `/docs`)
  - **Rate limit**: 25 requests per minute
  - **Response**: Confirmation that backend is running

## Configuration

The backend uses a JSON configuration file at `src/core_specs/configuration/config_file.json` and environment variables:

### Environment Variables
- `GOOGLE_SHEET_ID` - Your Google Sheets document ID
- `GOOGLE_SHEET_NAME` - Sheet name/tab name (default: "sheet_1")

### Google Sheets Setup
Your Google Sheet must be:
1. **Publicly accessible** (Anyone with the link can view)
2. **Published to web** (File → Share → Publish to web)
3. **Have the correct columns**: company, job_title, link

## Development

### Running in Development Mode
```bash
python main.py
```

### Docker Support

#### Using Docker Compose (Recommended)
```bash
# Build and start the services
docker-compose up --build

# Run in background
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Using Docker directly
```bash
# Build the image
docker build -t job-scraper-backend .

# Run the container
docker run -p 3001:3001 --env-file .env job-scraper-backend
```

#### Environment Variables for Docker
Make sure your `.env` file contains:
```env
GOOGLE_SHEET_ID=your_google_sheet_id_here
GOOGLE_SHEET_NAME=your_sheet_name_here
HOST=0.0.0.0
PORT=3001
```

## Troubleshooting

### Common Issues

1. **"Cannot connect to backend server"**
   - Ensure the backend is running on the correct port
   - Check firewall settings
   - Verify the API_BASE_URL in frontend configuration

2. **"Google Sheet ID not configured"**
   - Set GOOGLE_SHEET_ID in your .env file
   - Ensure the sheet ID is correct (from the Google Sheets URL)

3. **"Sheet is not publicly accessible"**
   - Make your Google Sheet public (Anyone with link can view)
   - Publish the sheet to web (File → Share → Publish to web)

4. **Rate limit exceeded**
   - Wait for the rate limit to reset
   - Adjust rate limits in config_file.json if needed

## Monitoring & Logs

### Application Logs
- **Location**: `logs/` directory
- **Format**: Timestamped JSON logs with log levels
- **Rotation**: New log file created on each startup

### Health Monitoring
- **Endpoint**: `GET /api/v1/health`
- **Docker Health Check**: Built-in health check every 30 seconds
- **Metrics**: Backend status, configuration validation, Google Sheets connectivity

### Performance Monitoring
- **Caching**: Job data cached for 5 minutes to reduce Google Sheets API calls
- **Rate Limiting**: Configurable per-endpoint rate limits
- **Response Times**: Logged for performance analysis

## Production Deployment

### Environment Variables
```env
# Required
GOOGLE_SHEET_ID=your_production_sheet_id
GOOGLE_SHEET_NAME=your_production_sheet_name

# Optional
HOST=0.0.0.0
PORT=3001
RATE_LIMIT_STORAGE_URI=redis://redis:6379  # For Redis-based rate limiting
```

### Docker Production Setup
```bash
# Production docker-compose with Redis
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Security Considerations
- **CORS**: Configure specific origins in production (not "*")
- **Rate Limiting**: Use Redis for distributed rate limiting
- **Logs**: Ensure log rotation and monitoring
- **Health Checks**: Monitor `/api/v1/health` endpoint
- **SSL/TLS**: Use reverse proxy (nginx) for HTTPS termination