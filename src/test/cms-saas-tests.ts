/**
 * Test suite for Optimizely CMS SaaS (Content Graph API)
 *
 * Usage: node build/test/cms-saas-tests.js [test-name]
 * Available tests:
 *   - create-blog: Create a blog page and get preview URL
 *   - preview-url: Test preview URL generation for existing content
 */

import { OptimizelyApiClient } from "../utils/optimizely-cms-client";
import axios from 'axios';

const PREVIEW_TOKEN = 'OptiPreview123';
const PREVIEW_DOMAIN = 'https://nestly.opti-demo.com';

const client = new OptimizelyApiClient({
  clientId: '77bcde0482d14318913a462794c42287',
  clientSecret: 'TliMjpNc2SvVKYDsONMvpNQEA1RWeBmCTGPerkTECpTSiTGB',
  baseUrl: 'https://app-epsadabuoas7yk1mp001.cms.optimizely.com',
});

async function testPreviewUrl(contentKey: string, contentVersion: string, pageUrl: string) {
  console.log('Testing preview URL generation...\n');

  try {
    const response = await axios.post(`${PREVIEW_DOMAIN}/api/preview-url.json`, {
      contentKey,
      contentVersion,
      pageUrl
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PREVIEW_TOKEN}`
      }
    });

    console.log('✅ Preview URL generated successfully!');
    console.log('Preview URL:', response.data.previewUrl);
    console.log('Token:', response.data.token);
    console.log('Expires in:', response.data.expiresIn);

    return response.data;
  } catch (error: any) {
    console.error('❌ Preview URL generation failed:', error.message);
    throw error;
  }
}

async function testCreateBlogAndPreview() {
  console.log('=== Testing: Create Blog + Preview URL ===\n');

  try {
    // Create a test blog page
    console.log('Step 1: Creating blog page...');
    const newPage = await client.createContent({
      contentType: 'BlogPage',
      container: 'fb9bc08b61754a8c8c751842f1d82638',
      displayName: 'Test Blog Post',
      locale: 'en',
      status: 'draft',
      properties: {
        Title: 'Test Blog Post',
        Subtitle: 'Testing the complete flow',
        Body: 'This is a test blog post.',
      }
    });

    console.log('✅ Page created!');
    console.log('Content Key:', newPage.key);
    console.log('Version:', newPage.version);

    // Generate preview URL
    console.log('\nStep 2: Generating preview URL...');
    const pageUrl = `/blog/${newPage.routeSegment}/`;
    const previewData = await testPreviewUrl(newPage.key!, newPage.version!, pageUrl);

    console.log('\n=== Test Complete ===');
    console.log('Page URL:', pageUrl);
    console.log('Preview URL:', previewData.previewUrl);

  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
  }
}

// Main test runner
const testName = process.argv[2];

if (testName === 'create-blog') {
  testCreateBlogAndPreview();
} else if (testName === 'preview-url') {
  const contentKey = process.argv[3];
  const contentVersion = process.argv[4];
  const pageUrl = process.argv[5];

  if (!contentKey || !contentVersion || !pageUrl) {
    console.log('Usage: node build/test/cms-saas-tests.js preview-url <contentKey> <version> <pageUrl>');
    process.exit(1);
  }

  testPreviewUrl(contentKey, contentVersion, pageUrl);
} else {
  console.log('Available tests:');
  console.log('  node build/test/cms-saas-tests.js create-blog');
  console.log('  node build/test/cms-saas-tests.js preview-url <contentKey> <version> <pageUrl>');
}
