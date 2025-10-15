# Job Dashboard Frontend

A modern, responsive job dashboard that displays software engineering positions from Google Sheets in a card-based layout similar to StepStone and Indeed.

## Features

- 📊 **Real-time Data**: Fetches job listings directly from Google Sheets
- 🔍 **Search & Filter**: Search jobs by title or company name
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- 🎨 **Modern UI**: Clean, professional interface with smooth animations
- ♿ **Accessible**: Keyboard navigation and screen reader friendly
- 🔄 **Auto-refresh**: Manual refresh button to get latest job data

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   Navigate to `http://localhost:5173`

## Configuration

The dashboard is configured to read from:
- **Sheet ID**: `1cXb9E8SRLSZtvHrQfuuY6RPuAfaH0AQBmMsGK7rZxn4`
- **Sheet Name**: `sheet_1`
- **Expected Columns**: `company`, `job_title`, `link`

### Google Sheets Setup

Make sure your Google Sheet is:
1. **Publicly accessible** (Anyone with the link can view)
2. **Has the correct column headers**: company, job_title, link
3. **Published to web** (File → Share → Publish to web)

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