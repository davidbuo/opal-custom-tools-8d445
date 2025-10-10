import { tool, ParameterType } from "@optimizely-opal/opal-tools-sdk";
import { OptimizelyCMS12Client } from "../utils/optimizely-cms12-client";

interface UpdatePageCms12Parameters {
  contentId: number;
  title?: string;
  teaserText?: string;
  body?: string;
  author?: string;
  status?: string;
  locale?: string;
}

async function db_cms12_update_page(parameters: UpdatePageCms12Parameters) {
  const { contentId, title, teaserText, body, author, status, locale } = parameters;

  // Initialize the Optimizely CMS 12 client
  const client = new OptimizelyCMS12Client({
    clientId: 'postman-client',
    clientSecret: 'postman',
    baseUrl: 'https://platform-showcase.optimizely.foundation',
  });

  try {
    // Build the update payload with only provided fields
    const updatePayload: any = {};

    // Update page name/title if provided
    if (title) {
      updatePayload.name = title;
      updatePayload.metaTitle = {
        value: title,
        propertyDataType: 'PropertyLongString'
      };
    }

    // Update teaser text if provided
    if (teaserText) {
      updatePayload.teaserText = {
        value: teaserText,
        propertyDataType: 'PropertyLongString'
      };
    }

    // Update main body if provided
    if (body) {
      updatePayload.mainBody = {
        value: body,
        propertyDataType: 'PropertyXhtmlString'
      };
    }

    // Update author if provided
    if (author) {
      updatePayload.authorMetaData = {
        value: author,
        propertyDataType: 'PropertyLongString'
      };
    }

    // Update status if provided (CheckedOut, Published, etc.)
    if (status) {
      updatePayload.status = status;
    }

    // Add locale if provided
    if (locale) {
      updatePayload.language = { name: locale };
    }

    // Perform the update
    const updatedPage = await client.updateContent(contentId, updatePayload);

    return {
      success: true,
      contentId: updatedPage.contentLink?.id,
      contentGuid: updatedPage.contentLink?.guidValue,
      name: updatedPage.name,
      contentType: updatedPage.contentType,
      status: updatedPage.status,
      routeSegment: updatedPage.routeSegment,
      url: updatedPage.url,
      editUrl: updatedPage.editUrl,
      previewUrl: updatedPage.previewUrl,
      changed: updatedPage.changed,
      message: `Successfully updated page (ID: ${contentId}) in CMS 12`,
      updatedFields: {
        title: title || null,
        teaserText: teaserText || null,
        body: body ? '(HTML content updated)' : null,
        author: author || null,
        status: status || null,
      }
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      message: `Failed to update page in CMS 12: ${error.message}`,
    };
  }
}

tool({
  name: "db_cms12_update_page",
  description: "Updates an existing page in Optimizely CMS 12 by content ID. You can update title, teaser text, body content (HTML), author, and status. Only provide the fields you want to update - all fields are optional except contentId.",
  parameters: [
    {
      name: "contentId",
      type: ParameterType.Number,
      description: "The content ID of the page to update (required)",
      required: true,
    },
    {
      name: "title",
      type: ParameterType.String,
      description: "The new title for the page (optional). Updates both page name and meta title.",
      required: false,
    },
    {
      name: "teaserText",
      type: ParameterType.String,
      description: "The new teaser/summary text (optional)",
      required: false,
    },
    {
      name: "body",
      type: ParameterType.String,
      description: "The new main body content in HTML format (optional)",
      required: false,
    },
    {
      name: "author",
      type: ParameterType.String,
      description: "The new author name (optional)",
      required: false,
    },
    {
      name: "status",
      type: ParameterType.String,
      description: "The new status: 'CheckedOut' (draft) or 'Published' (optional)",
      required: false,
    },
    {
      name: "locale",
      type: ParameterType.String,
      description: "The locale/language code (e.g., 'en', 'sv') (optional)",
      required: false,
    },
  ],
})(db_cms12_update_page);
