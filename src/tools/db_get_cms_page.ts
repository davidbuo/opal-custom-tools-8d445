import { tool, ParameterType } from "@optimizely-opal/opal-tools-sdk";
import { OptimizelyApiClient } from "../utils/optimizely-cms-client";

interface GetCmsPageParameters {
  contentKey: string;
  version?: string;
  locale?: string;
}

async function db_get_cms_page(parameters: GetCmsPageParameters) {
  const { contentKey, version, locale } = parameters;

  // Initialize the Optimizely CMS client
  const client = new OptimizelyApiClient({
    clientId: '77bcde0482d14318913a462794c42287',
    clientSecret: 'TliMjpNc2SvVKYDsONMvpNQEA1RWeBmCTGPerkTECpTSiTGB',
    baseUrl: 'https://app-epsadabuoas7yk1mp001.cms.optimizely.com',
  });

  try {
    // Get the content with all properties
    const content = await client.getContentByKey(contentKey, version, locale);

    // Structure the response in a clear format
    return {
      success: true,
      content: {
        key: content.key,
        contentType: content.contentType,
        displayName: content.displayName,
        version: content.version,
        locale: content.locale,
        status: content.status,
        container: content.container,
        routeSegment: content.routeSegment,
        lastModified: content.lastModified,
        lastModifiedBy: content.lastModifiedBy,
        published: content.published,
        properties: content.properties || {},
      },
      message: `Successfully retrieved content: "${content.displayName}"`,
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
  name: "db_get_cms_page",
  description: "Retrieves a CMS page by content key with all properties and their values in a structured format. Returns the complete content item including metadata and all property values.",
  parameters: [
    {
      name: "contentKey",
      type: ParameterType.String,
      description: "The content key (GUID) of the page to retrieve (required). Can be with or without dashes.",
      required: true,
    },
    {
      name: "version",
      type: ParameterType.String,
      description: "The specific version number to retrieve (optional, defaults to latest version)",
      required: false,
    },
    {
      name: "locale",
      type: ParameterType.String,
      description: "The locale/language code (e.g., 'en', 'sv') to retrieve (optional, defaults to all locales)",
      required: false,
    },
  ],
})(db_get_cms_page);
