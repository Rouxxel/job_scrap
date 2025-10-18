# Job Dashboard Frontend

A modern, responsive job dashboard that displays software engineering positions from Google Sheets in a card-based layout similar to StepStone and Indeed.

## Features

- 🔗 **Backend Integration**: Connects to FastAPI backend for job data
- 🔍 **Search & Filter**: Search jobs by title or company name
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- 🎨 **Modern UI**: Clean, professional interface with smooth animations
- ♿ **Accessible**: Keyboard navigation and screen reader friendly
- 🔄 **Smart Refresh**: Manual refresh with backend caching
- ⚙️ **Configurable**: Centralized configuration system for easy deployment
- 🔧 **Development Tools**: Runtime configuration management and debugging

## Complete Setup Workflow

### Step 1: Set up n8n Workflow (Data Collection)

Before running the frontend, you need to populate your Google Sheet with job data using the n8n workflow:

1. **Create an n8n account** at [n8n.io](https://n8n.io) or set up a self-hosted instance

2. **Import the workflow**:
   - Download the workflow file: `n8n/workflow/scraps_metal_v2.json`
   - In your n8n workspace, go to "Workflows" → "Import from File"
   - Upload the `scraps_metal_v2.json` file

3. **Configure the workflow**:
   - Open the `site_config.json` file from `n8n/configuration/site_config.json`
   - Update the `sheet_config` section with your Google Sheet details:
     ```json
     {
         "sheet_config": {
             "doc_id": "your_google_sheet_id_here",
             "job_sheet_name": "your_sheet_name_here"
         }
     }
     ```
   - Copy the entire contents of the updated `site_config.json`
   - In the n8n workflow, find the "Set" node
   - Paste the configuration into the Set node

4. **Run the workflow**:
   - Execute the workflow to populate your Google Sheet with job data
   - The workflow will scrape job listings and populate your sheet with company, job_title, and link columns

### Step 2: Set up Backend API

1. **Navigate to backend directory**:
   ```bash
   cd ../../backend
   ```

2. **Start the backend server**:
   ```bash
   python main.py
   ```
   
   The backend will be available at `http://localhost:3001`

### Step 3: Set up Frontend (Data Display)

## Prerequisites

Before running the frontend, you need:
- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)
- **Running backend server** from Step 2

## Setup Instructions

### 1. Navigate to Frontend Directory
```bash
cd frontend/minimal_dashboard
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the `frontend/minimal_dashboard` directory:

```bash
# Copy the example file
cp .env.example .env
```

Then edit the `.env` file and update the backend API URL:
```env
# Backend API URL (update when deploying)
VITE_API_BASE_URL=http://localhost:3001

# App customization (optional)
VITE_APP_TITLE=Job Dashboard - Software Engineering Positions
```

**For different deployments:**
- **Local development**: `http://localhost:3001`
- **Render.com**: `https://your-backend-service.onrender.com`
- **Custom domain**: `https://api.yourdomain.com`
### 4. Start Development Server
```bash
npm run dev
```

### 5. Open in Browser
Navigate to `http://localhost:5173`

## Configuration System

The frontend uses a centralized configuration system that supports multiple environments and easy deployment.

### Environment Variables

**Required:**
- `VITE_API_BASE_URL` - Backend API URL

**Optional:**
- `VITE_APP_TITLE` - Application title
- `VITE_ENVIRONMENT` - Environment override (development, staging, production)
- `VITE_DEBUG_MODE` - Enable debug features
- `VITE_JOBS_PER_PAGE` - Number of jobs per page

### Configuration Files

The configuration system is located in `src/config/`:
- `api.config.ts` - API endpoints and settings
- `app.config.ts` - Application settings
- `index.ts` - Configuration exports

### Runtime Configuration (Development)

In development mode, you can change the API URL at runtime:

```javascript
// Available in browser console
switchToLocal()        // Switch to localhost:3001
switchToProduction()   // Switch to production URL
testApi()             // Test current API connection
```

### Deployment Configuration

**Local Development:**
```env
VITE_API_BASE_URL=http://localhost:3001
VITE_ENVIRONMENT=development
```

**Production (Render.com):**
```env
VITE_API_BASE_URL=https://your-backend-service.onrender.com
VITE_ENVIRONMENT=production
```

**Production (Custom Domain):**
```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_ENVIRONMENT=production
```

For detailed configuration options, see [CONFIG.md](CONFIG.md).

## Data Format

The dashboard expects job data in this format:

| company | job_title | link |
|---------|-----------|------|
| Netflix | Senior Backend Engineer | https://... |
| Google | Frontend Developer | https://... |

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Troubleshooting

### CORS Issues
If you encounter CORS errors, make sure your Google Sheet is published to web and publicly accessible.

### No Data Showing
1. Check that the Sheet ID and name are correct
2. Verify the sheet has data in the expected format
3. Ensure the sheet is publicly accessible
4. Check browser console for error messages

### Performance
The dashboard fetches data on load and when manually refreshed. For high-frequency updates, consider implementing WebSocket connections or server-sent events.

## Customization

### Styling
- Main styles are in `src/App.css`
- Global styles in `src/index.css`
- Uses CSS Grid for responsive layout
- Color scheme can be customized via CSS variables

### Adding Features
- Job filtering by location, type, etc.
- Pagination for large datasets
- Job bookmarking/favorites
- Email alerts for new jobs
- Integration with job application tracking

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT License - see parent project for details.