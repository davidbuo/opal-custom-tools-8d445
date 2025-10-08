import { OptimizelyApiClient } from './utils/optimizely-cms-client';

async function testCreateContent() {
  const client = new OptimizelyApiClient({
    clientId: '77bcde0482d14318913a462794c42287',
    clientSecret: 'TliMjpNc2SvVKYDsONMvpNQEA1RWeBmCTGPerkTECpTSiTGB',
    baseUrl: 'https://app-epsadabuoas7yk1mp001.cms.optimizely.com',
  });

  try {
    console.log('🔐 Testing Optimizely CMS Content Creation...\n');

    // Step 1: Fetch BlogPage content type to understand its structure
    console.log('📚 Fetching BlogPage content type definition...');
    const blogPageType = await client.getContentType('BlogPage');

    console.log('\n✅ BlogPage Content Type:');
    console.log(`  Display Name: ${blogPageType.displayName}`);
    console.log(`  Description: ${blogPageType.description}`);
    console.log(`  Base Type: ${blogPageType.baseType}`);

    console.log('\n  Properties:');
    Object.keys(blogPageType.properties || {}).forEach(propKey => {
      const prop = blogPageType.properties[propKey];
      const required = prop.required ? '(REQUIRED)' : '';
      console.log(`    - ${propKey}: ${prop.type} ${required}`);
    });

    // Step 2: Prepare container (without dashes as per your instruction)
    const containerKey = 'fb9bc08b61754a8c8c751842f1d82638';
    console.log(`\n📋 Container key (without dashes): ${containerKey}`);

    // Verify the container exists
    try {
      const existingItems = await client.listContentItems(containerKey, undefined, 0, 5);
      console.log(`✅ Container verified with ${existingItems.totalItemCount || 0} existing items\n`);
    } catch (error: any) {
      console.log('⚠️  Could not access container:', error.message);
      console.log();
    }

    // Step 3: Create BlogPage with proper structure (required fields: Title, Subtitle, Body)
    console.log('📝 Creating new BlogPage...');

    const newContent = await client.createContent({
      contentType: 'BlogPage',
      container: containerKey, // Already without dashes
      displayName: 'Test Blog Post Created via API',
      locale: 'en',
      properties: {
        Title: 'My Test Blog Post', // Required
        Subtitle: 'This blog post was created using the Optimizely CMS API', // Required
        Body: 'This is the body content of the test blog post. It was created programmatically via the REST API.', // Required
      }
    });

    console.log('\n✅ Content created successfully!');
    console.log(`  Content Key: ${newContent.key}`);
    console.log(`  Display Name: ${newContent.locales?.en?.displayName || newContent.displayName}`);
    console.log(`  Content Type: ${newContent.contentType}`);
    console.log(`  Status: ${newContent.locales?.en?.status || newContent.status}`);

    console.log('\n  Full response:');
    console.log(JSON.stringify(newContent, null, 2));

    // Step 4: Verify the content was created
    console.log(`\n🔍 Verifying created content...`);
    const verifiedContent = await client.getContentByKey(newContent.key);
    console.log(`✅ Verification successful!`);
    console.log(`  Display Name: ${verifiedContent.locales?.en?.displayName}`);
    console.log(`  Title: ${verifiedContent.properties?.Title}`);
    console.log(`  Subtitle: ${verifiedContent.properties?.Subtitle}`);

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the test
testCreateContent();
