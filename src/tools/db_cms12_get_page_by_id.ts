import { tool, ParameterType } from "@optimizely-opal/opal-tools-sdk";
import { OptimizelyCMS12Client } from "../utils/optimizely-cms12-client";

interface GetPageByIdParameters {
  contentId: number;
  locale?: string;
}

async function db_cms12_get_page_by_id(parameters: GetPageByIdParameters) {
  const { contentId, locale } = parameters;

  // Initialize the Optimizely CMS 12 client
  const client = new OptimizelyCMS12Client({
    clientId: 'postman-client',
    clientSecret: 'postman',
    baseUrl: 'https://platform-showcase.optimizely.foundation',
  });

  try {
    const content = await client.getContentById(contentId, locale);

    return {
      success: true,
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
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      message: `Failed to retrieve content by ID ${contentId}: ${error.message}`,
    };
  }
}

tool({
  name: "db_cms12_get_page_by_id",
  description: "Retrieves a CMS 12 page by content ID. Returns the complete content item including metadata and all property values (title, teaser text, body, author, etc.).",
  parameters: [
    {
      name: "contentId",
      type: ParameterType.Number,
      description: "The content ID to retrieve (required)",
      required: true,
    },
    {
      name: "locale",
      type: ParameterType.String,
      description: "The locale/language code (e.g., 'en', 'sv') (optional)",
      required: false,
    },
  ],
})(db_cms12_get_page_by_id);
