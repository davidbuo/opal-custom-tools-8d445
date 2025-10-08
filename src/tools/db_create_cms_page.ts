import { tool, ParameterType } from "@optimizely-opal/opal-tools-sdk";
import { OptimizelyApiClient } from "../utils/optimizely-cms-client";

interface CreateCmsPageParameters {
  title: string;
  subtitle: string;
  body: string;
  author?: string;
  container?: string;
}

async function db_create_cms_page(parameters: CreateCmsPageParameters) {
  const { title, subtitle, body, author, container } = parameters;

  // Initialize the Optimizely CMS client
  const client = new OptimizelyApiClient({
    clientId: '77bcde0482d14318913a462794c42287',
    clientSecret: 'TliMjpNc2SvVKYDsONMvpNQEA1RWeBmCTGPerkTECpTSiTGB',
    baseUrl: 'https://app-epsadabuoas7yk1mp001.cms.optimizely.com',
  });

  // Default container for blog posts (without dashes)
  const defaultContainer = 'fb9bc08b61754a8c8c751842f1d82638';
  const targetContainer = container || defaultContainer;

  try {
    // Create the blog page
    const newPage = await client.createContent({
      contentType: 'BlogPage',
      container: targetContainer,
      displayName: title,
      locale: 'en',
      status: 'draft',
      properties: {
        Title: title,
        Subtitle: subtitle,
        Body: body,
      }
    });

    return {
      success: true,
      contentKey: newPage.key,
      displayName: newPage.displayName,
      contentType: newPage.contentType,
      status: newPage.status,
      version: newPage.version,
      routeSegment: newPage.routeSegment,
      lastModified: newPage.lastModified,
      message: `Successfully created blog page: "${title}"`,
      properties: {
        title: newPage.properties?.Title,
        subtitle: newPage.properties?.Subtitle,
        body: newPage.properties?.Body,
      }
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      message: `Failed to create blog page: ${error.message}`,
    };
  }
}

tool({
  name: "db_create_cms_page",
  description: "Creates a new blog page in the Optimizely CMS with the provided title, subtitle, and body content. The page will be created in draft status.",
  parameters: [
    {
      name: "title",
      type: ParameterType.String,
      description: "The title of the blog page (required)",
      required: true,
    },
    {
      name: "subtitle",
      type: ParameterType.String,
      description: "The subtitle of the blog page (required)",
      required: true,
    },
    {
      name: "body",
      type: ParameterType.String,
      description: "The main body content of the blog page (required)",
      required: true,
    },
    {
      name: "author",
      type: ParameterType.String,
      description: "The author of the blog page (optional)",
      required: false,
    },
    {
      name: "container",
      type: ParameterType.String,
      description: "The container key where the page should be created (optional, defaults to blog container)",
      required: false,
    },
  ],
})(db_create_cms_page);
