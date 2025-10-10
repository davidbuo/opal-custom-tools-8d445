import { OptimizelyCMS12Client } from './utils/optimizely-cms12-client';

async function testCMS12Client() {
  console.log('=== Testing Optimizely CMS 12 Client ===\n');

  // Replace these with your actual CMS 12 instance details
  const baseUrl = ''; // e.g., 'https://your-cms12-domain.com'
  const clientId = 'postman-client';
  const clientSecret = 'postman';

  if (!baseUrl) {
    console.log('Please set the baseUrl in the test script');
    console.log('Usage: Update the baseUrl variable in testCMS12Client()');
    return;
  }

  // Initialize client
  const client = new OptimizelyCMS12Client({
    clientId,
    clientSecret,
    baseUrl,
    debug: true,
  });

  try {
    // Test 1: List Content Types
    console.log('\n--- Test 1: List Content Types ---');
    const contentTypes = await client.listContentTypes();
    console.log(`Found ${contentTypes.length} content types`);
    if (contentTypes.length > 0) {
      console.log('First content type:', JSON.stringify(contentTypes[0], null, 2));
    }

    // Test 2: Get specific content (if you have a content ID, uncomment and test)
    // console.log('\n--- Test 2: Get Content by ID ---');
    // const contentId = 123; // Replace with actual content ID
    // const content = await client.getContentById(contentId);
    // console.log('Content:', JSON.stringify(content, null, 2));

    // Test 3: Get specific content type (if you have a content type ID, uncomment and test)
    // console.log('\n--- Test 3: Get Content Type ---');
    // const contentTypeId = 'ArticlePage'; // Replace with actual content type
    // const contentType = await client.getContentType(contentTypeId);
    // console.log('Content Type:', JSON.stringify(contentType, null, 2));

    console.log('\n✅ CMS 12 Client tests completed successfully!');
  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Allow running with command line arguments
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length >= 1) {
    const baseUrl = args[0];
    const clientId = args[1] || 'postman-client';
    const clientSecret = args[2] || 'postman';

    const client = new OptimizelyCMS12Client({
      clientId,
      clientSecret,
      baseUrl,
      debug: true,
    });

    // Run basic test
    client.listContentTypes()
      .then((types) => {
        console.log(`✅ Successfully authenticated and found ${types.length} content types`);
        if (types.length > 0) {
          console.log('Sample content type:', types[0].name || types[0].displayName);
        }
      })
      .catch((error) => {
        console.error('❌ Test failed:', error.message);
      });
  } else {
    testCMS12Client()
      .then(() => console.log('\nTest script completed'))
      .catch((error) => console.error('\nTest script failed:', error.message));
  }
}

export { testCMS12Client };
