import { tool, ParameterType } from "@optimizely-opal/opal-tools-sdk";
import { OptimizelyCMS12Client } from "../utils/optimizely-cms12-client";

interface SearchPagesParameters {
  searchTerm: string;
  locale?: string;
}

async function db_cms12_search_pages(parameters: SearchPagesParameters) {
  const { searchTerm, locale } = parameters;

  // Initialize the Optimizely CMS 12 client
  const client = new OptimizelyCMS12Client({
    clientId: 'postman-client',
    clientSecret: 'postman',
    baseUrl: 'https://platform-showcase.optimizely.foundation',
  });

  try {
    let searchResults: any[] = [];

    // First try exact match
    searchResults = await client.searchContentByTitle(searchTerm, locale);

    // If no exact match, try partial match (contains)
    if (searchResults.length === 0) {
      searchResults = await client.searchContentContains(searchTerm, locale);
    }

    if (searchResults.length === 0) {
      return {
        success: false,
        totalResults: 0,
        results: [],
        message: `No pages found matching search term: "${searchTerm}"`,
      };
    }

    // Format the results
    const formattedResults = searchResults.map(item => ({
      contentId: item.contentLink?.id,
      contentGuid: item.contentLink?.guidValue,
      name: item.name,
      contentType: item.contentType,
      status: item.status,
      language: item.language?.name,
      url: item.url,
      routeSegment: item.routeSegment,
      editUrl: item.editUrl,
      previewUrl: item.previewUrl,
    }));

    return {
      success: true,
      totalResults: searchResults.length,
      searchTerm: searchTerm,
      results: formattedResults,
      message: `Found ${searchResults.length} page(s) matching: "${searchTerm}"`,
    };

  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      message: `Failed to search pages: ${error.message}`,
    };
  }
}

tool({
  name: "db_cms12_search_pages",
  description: "Searches for CMS 12 pages by title. Performs exact match first, then partial match if no exact results. Returns a list of matching pages with basic metadata.",
  parameters: [
    {
      name: "searchTerm",
      type: ParameterType.String,
      description: "The search term to find in page titles (required). Supports exact and partial matching.",
      required: true,
    },
    {
      name: "locale",
      type: ParameterType.String,
      description: "The locale/language code to filter by (e.g., 'en', 'sv') (optional)",
      required: false,
    },
  ],
})(db_cms12_search_pages);
