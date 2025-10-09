import { tool, ParameterType } from "@optimizely-opal/opal-tools-sdk";
import { OptimizelyApiClient } from "../utils/optimizely-cms-client";

interface CreateCmsPageParameters {
  container: string;
  contentType: string;
  displayName: string;
  locale: string;
  properties: string;
}

async function db_create_cms_page(parameters: CreateCmsPageParameters) {
  const { container, contentType, displayName, locale, properties } = parameters;

  // Parse properties JSON string
  let parsedProperties: Record<string, any>;
  try {
    parsedProperties = JSON.parse(properties);
  } catch (error) {
    return {
      success: false,
      error: "Invalid JSON format for properties",
      message: "Failed to parse properties JSON. Please ensure it's valid JSON format.",
    };
  }

  // Initialize the Optimizely CMS client
  const client = new OptimizelyApiClient({
    clientId: '77bcde0482d14318913a462794c42287',
    clientSecret: 'TliMjpNc2SvVKYDsONMvpNQEA1RWeBmCTGPerkTECpTSiTGB',
    baseUrl: 'https://app-epsadabuoas7yk1mp001.cms.optimizely.com',
  });

  try {
    // Create the page with provided parameters
    const newPage = await client.createContent({
      contentType: contentType,
      container: container.replace(/-/g, ''), // Normalize container key (remove dashes)
      displayName: displayName,
      locale: locale,
      status: 'draft',
      properties: parsedProperties
    });

    return {
      success: true,
      contentKey: newPage.key,
      displayName: newPage.displayName,
      contentType: newPage.contentType,
      status: newPage.status,
      version: newPage.version,
      locale: newPage.locale,
      container: newPage.container,
      routeSegment: newPage.routeSegment,
      lastModified: newPage.lastModified,
      message: `Successfully created ${contentType} page: "${displayName}" in locale ${locale}`,
      properties: newPage.properties,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      message: `Failed to create CMS page: ${error.message}`,
    };
  }
}

tool({
  name: "db_create_cms_page",
  description: "Creates a new CMS page in Optimizely based on a given container ID, content type, locale, and properties. The page will be created in draft status. This is a generic tool that can create any content type in any container with any properties.",
  parameters: [
    {
      name: "container",
      type: ParameterType.String,
      description: "The container key (GUID) where the page should be created (required). Can include or exclude dashes.",
      required: true,
    },
    {
      name: "contentType",
      type: ParameterType.String,
      description: "The content type key (e.g., 'BlogPage', 'ArticlePage', 'StandardPage') (required)",
      required: true,
    },
    {
      name: "displayName",
      type: ParameterType.String,
      description: "The display name for the new page (required)",
      required: true,
    },
    {
      name: "locale",
      type: ParameterType.String,
      description: "The locale/language code (e.g., 'en', 'sv', 'fr') (required)",
      required: true,
    },
    {
      name: "properties",
      type: ParameterType.String,
      description: "JSON string containing the properties object for the page content (required). The structure depends on the content type. Example: {\"Title\": \"My Title\", \"Body\": \"Content here\"}",
      required: true,
    },
  ],
})(db_create_cms_page);
