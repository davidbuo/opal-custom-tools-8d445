import { OptimizelyApiClient } from '../utils/optimizely-cms-client';

/**
 * Example: Create a new ArticlePage under a specific container
 */
async function createArticlePage() {
  // Initialize the client
  const client = new OptimizelyApiClient({
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
    baseUrl: 'https://your-instance.cms.optimizely.com',
  });

  // Container ID where the article will be created (without dashes)
  const containerKey = '9950e45965c3436a896cb4f0cad8ce01';

  try {
    console.log('Creating new ArticlePage...');

    // Create the article
    const newArticle = await client.createContent({
      contentType: 'ArticlePage',
      container: containerKey,
      displayName: 'My New Article',
      status: 'draft', // or 'published'
      locale: 'en',
      properties: {
        Heading: 'Article Heading',
        SubHeading: 'Article Sub-heading',
        Author: 'John Doe',
        Body: 'Article body content here...',
        SeoSettings: {
          GraphType: 'article', // Required: 'article' or '-'
          MetaTitle: 'My Article - SEO Title',
          MetaDescription: 'SEO description for the article'
        }
      }
    });

    console.log('✅ Article created successfully!');
    console.log('Content Key:', newArticle.key);
    console.log('Display Name:', newArticle.displayName);

    return newArticle;

  } catch (error: any) {
    console.error('Failed to create article:', error.message);
    throw error;
  }
}

/**
 * Helper function to create an ArticlePage with common defaults
 */
export async function createArticlePageHelper(
  client: OptimizelyApiClient,
  params: {
    title: string;
    heading?: string;
    subHeading?: string;
    author?: string;
    body?: string;
    container?: string;
    status?: 'draft' | 'published';
    seoSettings?: {
      metaTitle?: string;
      metaDescription?: string;
      graphType?: 'article' | '-';
    };
    additionalProperties?: any;
  }
): Promise<any> {
  const defaultContainer = '9950e45965c3436a896cb4f0cad8ce01'; // Without dashes

  return await client.createContent({
    contentType: 'ArticlePage',
    container: params.container || defaultContainer,
    displayName: params.title,
    status: params.status || 'draft',
    locale: 'en',
    properties: {
      Heading: params.heading || params.title,
      SubHeading: params.subHeading,
      Author: params.author,
      Body: params.body,
      SeoSettings: {
        GraphType: params.seoSettings?.graphType || 'article', // Required field
        MetaTitle: params.seoSettings?.metaTitle || params.title,
        MetaDescription: params.seoSettings?.metaDescription,
      },
      ...params.additionalProperties
    }
  });
}

// Example usage:
// const client = new OptimizelyApiClient({ ... });
// const article = await createArticlePageHelper(client, {
//   title: 'My Article Title',
//   heading: 'Custom Heading',
//   author: 'John Doe',
//   body: 'Article content here...',
//   status: 'draft'
// });

export default createArticlePage;
