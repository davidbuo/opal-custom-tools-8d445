import { tool, ParameterType } from "@optimizely-opal/opal-tools-sdk";
import { OptimizelyCMS12Client } from "../utils/optimizely-cms12-client";

interface CreatePageCms12Parameters {
  parentId: number;
  contentType: string;
  title: string;
  teaserText?: string;
  body?: string;
  author?: string;
  locale: string;
  status?: string;
  existingContentId?: number;
}

async function db_cms12_create_page(parameters: CreatePageCms12Parameters) {
  const {
    parentId,
    contentType,
    title,
    teaserText,
    body,
    author,
    locale,
    status = 'CheckedOut',
    existingContentId
  } = parameters;

  // Initialize the Optimizely CMS 12 client
  const client = new OptimizelyCMS12Client({
    clientId: 'postman-client',
    clientSecret: 'postman',
    baseUrl: 'https://platform-showcase.optimizely.foundation',
  });

  try {
    // Generate route segment from title
    const routeSegment = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Build the payload
    const payload: any = {
      contentType: ['Page', contentType],
      name: title,
      language: { name: locale },
      status: status,
      metaTitle: {
        value: title,
        propertyDataType: 'PropertyLongString'
      },
    };

    // If this is a new language version of existing content
    if (existingContentId) {
      payload.contentLink = { id: existingContentId };
      // For language versions, we don't include parentLink or routeSegment
      // as they are culture-invariant
    } else {
      // This is a brand new page
      payload.parentLink = { id: parentId };
      payload.routeSegment = routeSegment;
    }

    // Add optional fields
    if (teaserText) {
      payload.teaserText = {
        value: teaserText,
        propertyDataType: 'PropertyLongString'
      };
    }

    if (body) {
      payload.mainBody = {
        value: body,
        propertyDataType: 'PropertyXhtmlString'
      };
    }

    if (author) {
      payload.authorMetaData = {
        value: author,
        propertyDataType: 'PropertyLongString'
      };
    }

    // Create the page
    const newPage = await client.createContent(payload);

    return {
      success: true,
      contentId: newPage.contentLink?.id,
      contentGuid: newPage.contentLink?.guidValue,
      name: newPage.name,
      contentType: newPage.contentType,
      status: newPage.status,
      locale: newPage.language?.name,
      routeSegment: newPage.routeSegment,
      url: newPage.url,
      editUrl: newPage.editUrl,
      previewUrl: newPage.previewUrl,
      created: newPage.created,
      message: existingContentId
        ? `Successfully created ${locale} language version for content ID ${existingContentId}`
        : `Successfully created new page in CMS 12`,
    };

  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      message: `Failed to create page in CMS 12: ${error.message}`,
    };
  }
}

tool({
  name: "db_cms12_create_page",
  description: "Creates a new page in Optimizely CMS 12 OR creates a new language version of an existing page. Use existingContentId to create a language translation, or omit it to create a brand new page.",
  parameters: [
    {
      name: "parentId",
      type: ParameterType.Number,
      description: "The parent container ID where the page will be created (required for new pages, ignored for language versions)",
      required: true,
    },
    {
      name: "contentType",
      type: ParameterType.String,
      description: "The content type (e.g., 'StandardPage', 'ArticlePage') (required)",
      required: true,
    },
    {
      name: "title",
      type: ParameterType.String,
      description: "The page title (required)",
      required: true,
    },
    {
      name: "teaserText",
      type: ParameterType.String,
      description: "The teaser/summary text (optional)",
      required: false,
    },
    {
      name: "body",
      type: ParameterType.String,
      description: "The main body content in HTML format (optional)",
      required: false,
    },
    {
      name: "author",
      type: ParameterType.String,
      description: "The author name (optional)",
      required: false,
    },
    {
      name: "locale",
      type: ParameterType.String,
      description: "The locale/language code (e.g., 'en', 'sv', 'no') (required)",
      required: true,
    },
    {
      name: "status",
      type: ParameterType.String,
      description: "The status: 'CheckedOut' (draft) or 'Published' (optional, defaults to 'CheckedOut')",
      required: false,
    },
    {
      name: "existingContentId",
      type: ParameterType.Number,
      description: "If provided, creates a new language version of this existing content ID. If omitted, creates a brand new page. (optional)",
      required: false,
    },
  ],
})(db_cms12_create_page);
