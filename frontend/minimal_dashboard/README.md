# Job Dashboard Frontend

A modern, responsive job dashboard that displays software engineering positions from Google Sheets in a card-based layout similar to StepStone and Indeed.

## Features

- 📊 **Real-time Data**: Fetches job listings directly from Google Sheets
- 🔍 **Search & Filter**: Search jobs by title or company name
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- 🎨 **Modern UI**: Clean, professional interface with smooth animations
- ♿ **Accessible**: Keyboard navigation and screen reader friendly
- 🔄 **Auto-refresh**: Manual refresh button to get latest job data

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
             "sheet_1_name": "your_sheet_name_here"
         }
     }
     ```
   - Copy the entire contents of the updated `site_config.json`
   - In the n8n workflow, find the "Set" node
   - Paste the configuration into the Set node

4. **Run the workflow**:
   - Execute the workflow to populate your Google Sheet with job data
   - The workflow will scrape job listings and populate your sheet with company, job_title, and link columns

### Step 2: Set up Frontend (Data Display)

## Prerequisites

Before running the frontend, you need:
- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)
- **Google Sheet ID** and **Sheet Name** for your job data

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
Create a `.env` file in the `frontend/minimal_dashboard` directory with your Google Sheets configuration:

```bash
# Copy the example file
cp .env.example .env
```

Then edit the `.env` file and update these required variables:
```env
# Replace with your Google Sheet ID and sheet name
VITE_SHEET_ID=your_google_sheet_id_here
VITE_SHEET_NAME=your_sheet_name_here
```

**How to get your Google Sheet ID:**
- Open your Google Sheet in a browser
- Copy the ID from the URL: `https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit`
- The Sheet ID is the long string between `/d/` and `/edit`

**Sheet Name:**
- This is the name of the tab/worksheet in your Google Sheet (e.g., "Sheet1", "Jobs", etc.)

### 4. Start Development Server
```bash
npm run dev
```

### 5. Open in Browser
Navigate to `http://localhost:5173`

## Configuration

The dashboard reads job data from Google Sheets using these environment variables:
- **VITE_SHEET_ID**: Your Google Sheet document ID
- **VITE_SHEET_NAME**: The specific sheet/tab name within the document
- **Expected Columns**: `company`, `job_title`, `link`

### Google Sheets Setup

To use your Google Sheet as a data source, follow these steps:

1. **Create or prepare your Google Sheet** with the required columns:
   - `company` - Company name
   - `job_title` - Job position title  
   - `link` - URL to the job posting

2. **Make the sheet publicly accessible**:
   - Click "Share" button in your Google Sheet
   - Change access to "Anyone with the link can view"
   - Copy the sharing link

3. **Publish to web** (required for CSV access):
   - Go to File → Share → Publish to web
   - Select the specific sheet/tab you want to publish
   - Choose "Comma-separated values (.csv)" as the format
   - Click "Publish"

4. **Get your Sheet ID and Name**:
   - Sheet ID: Extract from the URL `https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit`
   - Sheet Name: The name of the tab (visible at the bottom of the sheet)

5. **Update your `.env` file** with these values

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