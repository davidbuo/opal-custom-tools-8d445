/**
 * Show the exact JSON response from db_cms12_get_page_by_id tool
 */

import { OptimizelyCMS12Client } from '../utils/optimizely-cms12-client';

async function showToolResponse() {
  const contentId = 636;
  const locale = undefined;

  // Initialize the Optimizely CMS 12 client
  const client = new OptimizelyCMS12Client({
    clientId: 'postman-client',
    clientSecret: 'postman',
    baseUrl: 'https://platform-showcase.optimizely.foundation',
  });

  try {
    const content = await client.getContentById(contentId, locale);

    // This is what the tool returns
    const toolResponse = {
      success: true,
      content: {
        contentId: content.contentLink?.id,
        contentGuid: content.contentLink?.guidValue,
        name: content.name,
        contentType: content.contentType,
        status: content.status,
        url: content.url,
        routeSegment: content.routeSegment,
        language: content.language?.name,
        created: content.created,
        changed: content.changed,
        properties: {
          metaTitle: content.metaTitle?.value,
          teaserText: content.teaserText?.value,
          mainBody: content.mainBody?.value,
          authorMetaData: content.authorMetaData?.value,
        },
        fullContent: content
      },
      message: `Successfully retrieved content ID ${contentId}`
    };

    console.log(JSON.stringify(toolResponse, null, 2));

  } catch (error: any) {
    const errorResponse = {
      success: false,
      error: error.message,
      message: `Failed to retrieve content ID ${contentId}: ${error.message}`
    };

    console.log(JSON.stringify(errorResponse, null, 2));
  }
}

showToolResponse();
