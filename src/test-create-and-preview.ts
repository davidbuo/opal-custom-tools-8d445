import { OptimizelyApiClient } from "./utils/optimizely-cms-client";
import { testPreviewUrl } from "./test-preview-url";

const PREVIEW_TOKEN = 'OptiPreview123';
const PREVIEW_DOMAIN = 'https://nestly.opti-demo.com';

async function testCreateAndGetPreview() {
  console.log('=== Testing Complete Flow: Create Page + Get Preview URL ===\n');

  // Step 1: Create a new blog page
  console.log('Step 1: Creating a new blog page...');
  const client = new OptimizelyApiClient({
    clientId: '77bcde0482d14318913a462794c42287',
    clientSecret: 'TliMjpNc2SvVKYDsONMvpNQEA1RWeBmCTGPerkTECpTSiTGB',
    baseUrl: 'https://app-epsadabuoas7yk1mp001.cms.optimizely.com',
  });

  try {
    // Create a test blog page
    const newPage = await client.createContent({
      contentType: 'BlogPage',
      container: 'fb9bc08b61754a8c8c751842f1d82638', // Blog container
      displayName: 'Test Page with Preview URL',
      locale: 'en',
      status: 'draft',
      properties: {
        Title: 'Test Page with Preview URL',
        Subtitle: 'Testing the complete flow from creation to preview',
        Body: 'This page was created to test the preview URL generation flow.',
      }
    });

    console.log('✅ Page created successfully!');
    console.log('Content Key:', newPage.key);
    console.log('Version:', newPage.version);
    console.log('Route Segment:', newPage.routeSegment);
    console.log('Content Type:', newPage.contentType);
    console.log('Locale:', newPage.locale);

    // Step 2: Generate the page URL based on content type
    // BlogPage -> /blog/{routeSegment}/
    // ArticlePage -> /articles/{routeSegment}/ (or similar)
    let pageUrl: string;
    if (newPage.contentType === 'BlogPage') {
      pageUrl = `/blog/${newPage.routeSegment}/`;
    } else if (newPage.contentType === 'ArticlePage') {
      pageUrl = `/articles/${newPage.routeSegment}/`;
    } else {
      // Default fallback
      pageUrl = `/${newPage.routeSegment}/`;
    }
    console.log('\nStep 2: Constructed page URL:', pageUrl);

    // Step 3: Get the preview URL
    console.log('\nStep 3: Calling preview URL API...');
    const previewData = await testPreviewUrl(
      PREVIEW_DOMAIN,
      newPage.key!,
      newPage.version!,
      pageUrl,
      PREVIEW_TOKEN
    );

    // Step 4: Display final results
    console.log('\n=== Final Results ===');
    console.log('Content Key:', newPage.key);
    console.log('Version:', newPage.version);
    console.log('Display Name:', newPage.displayName);
    console.log('Status:', newPage.status);
    console.log('Page URL:', pageUrl);
    console.log('Preview URL:', previewData.previewUrl);
    console.log('Preview Token:', previewData.token);
    console.log('Token Expiration:', previewData.expiresIn);

    return {
      page: newPage,
      preview: previewData,
    };

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    throw error;
  }
}

// Run the test
if (require.main === module) {
  testCreateAndGetPreview()
    .then(() => console.log('\n✅ Complete flow test successful!'))
    .catch(() => console.log('\n❌ Complete flow test failed!'));
}

export { testCreateAndGetPreview };
