/**
 * Test suite for Optimizely CMS 12 (Content Management API)
 *
 * Usage: node build/test/cms12-tests.js [test-name] [args...]
 * Available tests:
 *   - get-by-id <contentId>: Get content by ID
 *   - search <searchTerm>: Search for content by title
 *   - create-blog: Create a test blog post
 *   - list-types: List all content types
 */

import { OptimizelyCMS12Client } from '../utils/optimizely-cms12-client';

const client = new OptimizelyCMS12Client({
  clientId: 'postman-client',
  clientSecret: 'postman',
  baseUrl: 'https://platform-showcase.optimizely.foundation',
});

async function testGetById(contentId: number) {
  console.log(`=== Getting content ID ${contentId} ===\n`);

  try {
    const content = await client.getContentById(contentId);

    console.log('✅ Content found:');
    console.log('Name:', content.name);
    console.log('Type:', content.contentType?.join(', '));
    console.log('Status:', content.status);
    console.log('URL:', content.url);
    console.log('\nProperties:');
    console.log('  metaTitle:', content.metaTitle?.value);
    console.log('  teaserText:', content.teaserText?.value);
    if (content.mainBody?.value) {
      console.log('  mainBody:', content.mainBody.value.substring(0, 100) + '...');
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

async function testSearch(searchTerm: string) {
  console.log(`=== Searching for: "${searchTerm}" ===\n`);

  try {
    // Try exact match
    console.log('Exact match:');
    const exactResults = await client.searchContentByTitle(searchTerm);
    console.log(`  Found ${exactResults.length} results`);
    exactResults.forEach((r, i) => {
      console.log(`  ${i + 1}. "${r.name}" (ID: ${r.contentLink?.id}, Status: ${r.status})`);
    });

    // Try partial match if no exact results
    if (exactResults.length === 0) {
      console.log('\nPartial match (contains):');
      const containsResults = await client.searchContentContains(searchTerm);
      console.log(`  Found ${containsResults.length} results`);
      containsResults.forEach((r, i) => {
        console.log(`  ${i + 1}. "${r.name}" (ID: ${r.contentLink?.id}, Status: ${r.status})`);
      });
    }

    console.log('\n💡 Note: Search only finds Published content, not draft (CheckedOut) pages.');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

async function testCreateBlog() {
  console.log('=== Creating test blog post ===\n');

  try {
    const title = `Test Blog Post ${new Date().toISOString()}`;
    const routeSegment = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const newPage = await client.createContent({
      contentType: ['Page', 'StandardPage'],
      name: title,
      parentLink: { id: 633 },
      routeSegment: routeSegment,
      language: { name: 'en' },
      status: 'CheckedOut',
      metaTitle: { value: title, propertyDataType: 'PropertyLongString' },
      teaserText: { value: 'This is a test blog post', propertyDataType: 'PropertyLongString' },
      mainBody: { value: '<p>Test content</p>', propertyDataType: 'PropertyXhtmlString' },
    });

    console.log('✅ Blog post created!');
    console.log('Content ID:', newPage.contentLink?.id);
    console.log('Name:', newPage.name);
    console.log('Status:', newPage.status);
    console.log('URL:', newPage.url);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

async function testListTypes() {
  console.log('=== Listing content types ===\n');

  try {
    const types = await client.listContentTypes();
    console.log(`✅ Found ${types.length} content types\n`);

    // Show first 10
    types.slice(0, 10).forEach((type, i) => {
      console.log(`${i + 1}. ${type.name || type.displayName}`);
    });

    if (types.length > 10) {
      console.log(`\n... and ${types.length - 10} more`);
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

// Main test runner
const testName = process.argv[2];

if (testName === 'get-by-id') {
  const contentId = parseInt(process.argv[3]);
  if (!contentId) {
    console.log('Usage: node build/test/cms12-tests.js get-by-id <contentId>');
    process.exit(1);
  }
  testGetById(contentId);
} else if (testName === 'search') {
  const searchTerm = process.argv[3];
  if (!searchTerm) {
    console.log('Usage: node build/test/cms12-tests.js search <searchTerm>');
    process.exit(1);
  }
  testSearch(searchTerm);
} else if (testName === 'create-blog') {
  testCreateBlog();
} else if (testName === 'list-types') {
  testListTypes();
} else {
  console.log('Available tests:');
  console.log('  node build/test/cms12-tests.js get-by-id <contentId>');
  console.log('  node build/test/cms12-tests.js search <searchTerm>');
  console.log('  node build/test/cms12-tests.js create-blog');
  console.log('  node build/test/cms12-tests.js list-types');
}
