// Test the db_create_cms_page tool directly
import { OptimizelyApiClient } from '../utils/optimizely-cms-client';

async function testTool() {
  const client = new OptimizelyApiClient({
    clientId: '77bcde0482d14318913a462794c42287',
    clientSecret: 'TliMjpNc2SvVKYDsONMvpNQEA1RWeBmCTGPerkTECpTSiTGB',
    baseUrl: 'https://app-epsadabuoas7yk1mp001.cms.optimizely.com',
  });

  console.log('🧪 Testing db_create_cms_page tool...\n');

  const parameters = {
    title: 'Test Blog Post via Tool',
    subtitle: 'This is a test blog post created using the db_create_cms_page tool',
    body: 'This is the body content of the blog post. It demonstrates the tool working correctly.',
  };

  try {
    // Create the blog page
    const newPage = await client.createContent({
      contentType: 'BlogPage',
      container: 'fb9bc08b61754a8c8c751842f1d82638',
      displayName: parameters.title,
      locale: 'en',
      status: 'draft',
      properties: {
        Title: parameters.title,
        Subtitle: parameters.subtitle,
        Body: parameters.body,
      }
    });

    console.log('✅ Success!');
    console.log('Response:');
    console.log(JSON.stringify({
      success: true,
      contentKey: newPage.key,
      displayName: newPage.displayName,
      contentType: newPage.contentType,
      status: newPage.status,
      version: newPage.version,
      routeSegment: newPage.routeSegment,
      message: `Successfully created blog page: "${parameters.title}"`,
      properties: {
        title: newPage.properties?.Title,
        subtitle: newPage.properties?.Subtitle,
        body: newPage.properties?.Body,
      }
    }, null, 2));

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.log(JSON.stringify({
      success: false,
      error: error.message,
      message: `Failed to create blog page: ${error.message}`,
    }, null, 2));
  }
}

testTool();
