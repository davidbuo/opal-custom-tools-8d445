import { tool, ParameterType } from "@optimizely-opal/opal-tools-sdk";
import { OptimizelyCMS12Client } from "../utils/optimizely-cms12-client";

interface GetPageCms12Parameters {
  contentId?: number;
  title?: string;
  locale?: string;
}

async function db_cms12_get_page(parameters: GetPageCms12Parameters) {
  const { contentId, title, locale } = parameters;

  // Initialize the Optimizely CMS 12 client
  const client = new OptimizelyCMS12Client({
    clientId: 'postman-client',
    clientSecret: 'postman',
    baseUrl: 'https://platform-showcase.optimizely.foundation',
  });

  try {
    let content: any;
    let searchResults: any[] = [];

    // If contentId is provided, fetch by ID
    if (contentId) {
      content = await client.getContentById(contentId, locale);

      return {
        success: true,
        method: 'getById',
        content: {
          contentId: content.contentLink?.id,
          contentGuid: content.contentLink?.guidValue,
          name: content.name,
          contentType: content.contentType,
          status: content.status,
          language: content.language?.name,
          routeSegment: content.routeSegment,
          url: content.url,
          editUrl: content.editUrl,
          previewUrl: content.previewUrl,
          created: content.created,
          changed: content.changed,
          published: content.startPublish,
          properties: {
            metaTitle: content.metaTitle?.value,
            teaserText: content.teaserText?.value,
            mainBody: content.mainBody?.value,
            authorMetaData: content.authorMetaData?.value,
            pageDescription: content.pageDescription?.value,
            keywords: content.keywords?.value,
          },
          fullContent: content,
        },
        message: `Successfully retrieved content by ID: ${contentId}`,
      };
    }

    // If title is provided, search by title
    if (title) {
      // First try exact match
      searchResults = await client.searchContentByTitle(title, locale);

      // If no exact match, try contains search
      if (searchResults.length === 0) {
        searchResults = await client.searchContentContains(title, locale);
      }

      if (searchResults.length === 0) {
        return {
          success: false,
          method: 'searchByTitle',
          error: 'No content found with that title',
          message: `No content found matching title: "${title}"`,
        };
      }

      // Return all matching results
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
        method: 'searchByTitle',
        totalResults: searchResults.length,
        results: formattedResults,
        message: `Found ${searchResults.length} result(s) for title: "${title}"`,
      };
    }

    // If neither contentId nor title is provided
    return {
      success: false,
      error: 'Missing parameters',
      message: 'Please provide either contentId or title parameter',
    };

  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      message: `Failed to retrieve content: ${error.message}`,
    };
  }
}

tool({
  name: "db_cms12_get_page",
  description: "Retrieves a CMS 12 page by content ID or searches by title. Returns the complete content item including metadata and all property values. Can search by exact title match or partial match.",
  parameters: [
    {
      name: "contentId",
      type: ParameterType.Number,
      description: "The content ID to retrieve (optional if title is provided)",
      required: false,
    },
    {
      name: "title",
      type: ParameterType.String,
      description: "The page title to search for (optional if contentId is provided). Supports exact and partial matching.",
      required: false,
    },
    {
      name: "locale",
      type: ParameterType.String,
      description: "The locale/language code (e.g., 'en', 'sv') (optional)",
      required: false,
    },
  ],
})(db_cms12_get_page);
