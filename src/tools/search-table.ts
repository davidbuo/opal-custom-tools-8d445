import { tool, ParameterType } from "@optimizely-opal/opal-tools-sdk";

interface SearchTableParameters {
  query?: string;
  limit?: number;
}

interface TableRow {
  [key: string]: string;
}

async function searchTable(parameters: SearchTableParameters) {
  const { query, limit = 10 } = parameters;

  // Convert Google Sheets edit URL to CSV export URL
  const sheetId = "1J5yF5nnR0hfbT67BFr-lX2A_ifA7C_ggwlQ2Xh138EA";
  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;

  try {
    // Fetch the CSV data
    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet data: ${response.status} ${response.statusText}`);
    }

    const csvText = await response.text();

    // Parse CSV data
    const rows = csvText.split('\n').filter(row => row.trim() !== '');
    if (rows.length === 0) {
      return { error: "No data found in the sheet" };
    }

    // Get headers from first row
    const headers = rows[0].split(',').map(header => header.replace(/"/g, '').trim());

    // Convert rows to objects
    const data: TableRow[] = [];
    for (let i = 1; i < rows.length; i++) {
      const values = rows[i].split(',').map(value => value.replace(/"/g, '').trim());
      if (values.length >= headers.length) {
        const row: TableRow = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        data.push(row);
      }
    }

    // Filter data based on query if provided
    let filteredData = data;
    if (query && query.trim() !== '') {
      const searchTerm = query.toLowerCase();
      filteredData = data.filter(row =>
        Object.values(row).some(value =>
          value.toLowerCase().includes(searchTerm)
        )
      );
    }

    // Apply limit
    const limitedData = filteredData.slice(0, limit);

    return {
      total_rows: data.length,
      filtered_rows: filteredData.length,
      returned_rows: limitedData.length,
      headers: headers,
      data: limitedData,
      query_used: query || "none"
    };

  } catch (error) {
    throw new Error(`Failed to search table: ${error instanceof Error ? error.message : String(error)}`);
  }
}

tool({
  name: "search_table",
  description: "Search and retrieve data from a Google Sheets table containing Swedish national football team match attendance data. You can filter results with a search query and limit the number of results returned.",
  parameters: [
    {
      name: "query",
      type: ParameterType.String,
      description: "Search query to filter the data (searches across all columns). Leave empty to get all data.",
      required: false,
    },
    {
      name: "limit",
      type: ParameterType.Number,
      description: "Maximum number of rows to return (default: 10, max recommended: 50)",
      required: false,
    },
  ],
})(searchTable);