import { tool, ParameterType } from "@optimizely-opal/opal-tools-sdk";
import { OptimizelyCMS12Client } from "../utils/optimizely-cms12-client";

interface CreateBlogCms12Parameters {
  title: string;
  teaserText: string;
  body: string;
  author?: string;
}

async function db_cms12_create_blog(parameters: CreateBlogCms12Parameters) {
  const { title, teaserText, body, author } = parameters;

  // Initialize the Optimizely CMS 12 client
  const client = new OptimizelyCMS12Client({
    clientId: 'postman-client',
    clientSecret: 'postman',
    baseUrl: 'https://platform-showcase.optimizely.foundation',
  });

  // Container ID for blog posts
  const parentContentId = 633;

  try {
    // Generate route segment from title
    const routeSegment = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Create the StandardPage blog post
    const newPage = await client.createContent({
      contentType: ['Page', 'StandardPage'],
      name: title,
      parentLink: { id: parentContentId },
      routeSegment: routeSegment,
      language: { name: 'en' },
      status: 'CheckedOut',
      metaTitle: {
        value: title,
        propertyDataType: 'PropertyLongString'
      },
      teaserText: {
        value: teaserText,
        propertyDataType: 'PropertyLongString'
      },
      mainBody: {
        value: body,
        propertyDataType: 'PropertyXhtmlString'
      },
      authorMetaData: author ? {
        value: author,
        propertyDataType: 'PropertyLongString'
      } : undefined
    });

    return {
      success: true,
      contentId: newPage.contentLink?.id,
      contentGuid: newPage.contentLink?.guidValue,
      name: newPage.name,
      contentType: newPage.contentType,
      status: newPage.status,
      routeSegment: newPage.routeSegment,
      url: newPage.url,
      editUrl: newPage.editUrl,
      previewUrl: newPage.previewUrl,
      message: `Successfully created blog page: "${title}" in CMS 12`,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      message: `Failed to create blog page in CMS 12: ${error.message}`,
    };
  }
}

tool({
  name: "db_cms12_create_blog",
  description: "Creates a new blog page (StandardPage) in Optimizely CMS 12 with the provided title, teaser text, and HTML body content. The page will be created under content ID 633 in CheckedOut status.",
  parameters: [
    {
      name: "title",
      type: ParameterType.String,
      description: "The title of the blog page (required). Used for both page name and meta title.",
      required: true,
    },
    {
      name: "teaserText",
      type: ParameterType.String,
      description: "The teaser/summary text for the blog page (required)",
      required: true,
    },
    {
      name: "body",
      type: ParameterType.String,
      description: "The main body content of the blog page in HTML format (required)",
      required: true,
    },
    {
      name: "author",
      type: ParameterType.String,
      description: "The author of the blog page (optional)",
      required: false,
    },
  ],
})(db_cms12_create_blog);
