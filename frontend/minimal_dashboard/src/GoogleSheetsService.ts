// Google Sheets API service
export interface Job {
  company: string;
  job_title: string;
  link: string;
}

const SHEET_ID = import.meta.env.VITE_SHEET_ID || '1cXb9E8SRLSZtvHrQfuuY6RPuAfaH0AQBmMsGK7rZxn4';
const SHEET_NAME = import.meta.env.VITE_SHEET_NAME || 'sheet_1';

// Method 1: CSV Export (requires public sheet)
export const fetchJobsFromCSV = async (): Promise<Job[]> => {
  const urls = [
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`,
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`,
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0&single=true&output=csv`
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (!response.ok) continue;
      
      const csvText = await response.text();
      if (csvText.includes('accounts.google.com') || csvText.includes('Sign in')) {
        continue;
      }
      
      return parseCSV(csvText);
    } catch (error) {
      console.error('CSV fetch failed:', error);
    }
  }
  
  throw new Error('All CSV methods failed. Please ensure the sheet is public.');
};

// Method 2: Google Sheets API (requires API key)
export const fetchJobsFromAPI = async (apiKey: string): Promise<Job[]> => {
  const range = `${SHEET_NAME}!A:C`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${apiKey}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Google Sheets API error: ${response.status}`);
  }
  
  const data = await response.json();
  const rows = data.values || [];
  
  // Skip header row and convert to Job objects
  return rows.slice(1).map((row: string[]) => ({
    company: row[0] || 'Unknown Company',
    job_title: row[1] || 'Unknown Position',
    link: row[2] || '#'
  })).filter((job: Job) => 
    job.company !== 'Unknown Company' && job.job_title !== 'Unknown Position'
  );
};

// Helper function to parse CSV
const parseCSV = (csvText: string): Job[] => {
  const rows = csvText.split('\n').slice(1); // Skip header row
  
  return rows
    .filter(row => row.trim()) // Filter out empty rows
    .map(row => {
      // Parse CSV row (handle quoted values)
      const columns = row.split(',').map(col => col.replace(/^"|"$/g, '').trim());
      return {
        company: columns[0] || 'Unknown Company',
        job_title: columns[1] || 'Unknown Position',
        link: columns[2] || '#'
      };
    })
    .filter(job => job.company !== 'Unknown Company' && job.job_title !== 'Unknown Position');
};