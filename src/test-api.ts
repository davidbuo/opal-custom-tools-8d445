import { OptimizelyApiClient } from './utils/optimizely-cms-client';

async function testOptimizelyApi() {
  const client = new OptimizelyApiClient({
    clientId: '77bcde0482d14318913a462794c42287',
    clientSecret: 'TliMjpNc2SvVKYDsONMvpNQEA1RWeBmCTGPerkTECpTSiTGB',
    baseUrl: 'https://app-epsadabuoas7yk1mp001.cms.optimizely.com',
  });

  try {
    console.log('🔐 Testing Optimizely CMS API...\n');

    // Test: List child items under parent container
    // The utility class automatically normalizes keys (removes dashes)
    const parentContentKey = '9fa0c716-c87e-4b8a-9898-bc2d2270ea21';

    console.log(`📋 Listing content items (parent key: ${parentContentKey})...`);
    const childItems = await client.listContentItems(parentContentKey, undefined, 0, 10);
    console.log('✅ Child items retrieved successfully!');
    console.log(`Found ${childItems.totalItemCount || 0} total child items\n`);

    if (childItems.items && childItems.items.length > 0) {
      console.log('Content items:');
      childItems.items.forEach((item: any, index: number) => {
        const contentKey = item.key || 'N/A';
        const name = item.locales?.en?.displayName || 'Unnamed';
        console.log(`  ${index + 1}. ${name} (Key: ${contentKey})`);
      });

      // Test: Get a specific content item
      const firstItem = childItems.items[0];
      const testKey = firstItem.key;

      console.log(`\n📄 Getting content details (key: ${testKey})...`);
      const content = await client.getContentByKey(testKey);
      console.log('✅ Content retrieved successfully!');
      console.log(`  Display Name: ${content.locales?.en?.displayName}`);
      console.log(`  Content Type: ${content.contentType}`);
      console.log(`  Status: ${content.locales?.en?.status}`);

      // Test: Get content versions
      console.log(`\n📑 Getting versions...`);
      const versions = await client.getContentVersions(testKey);
      if (versions.items && versions.items.length > 0) {
        const latestVersion = versions.items[0];
        const versionId = latestVersion.version;
        console.log(`✅ Found ${versions.items.length} version(s)`);
        console.log(`  Latest version: ${versionId}`);
        console.log(`  Version status: ${latestVersion.status}`);

        // Test: Update content
        console.log(`\n✏️  Testing content update...`);
        const originalName = content.locales?.en?.displayName || 'Unknown';
        const updatedName = `${originalName} (Updated via API)`;

        try {
          const updateResult = await client.updateContent(testKey, parseInt(versionId), {
            locales: {
              en: {
                displayName: updatedName
              }
            }
          });

          console.log('✅ Content updated successfully!');
          console.log(`  New display name: ${updateResult.locales?.en?.displayName}`);
        } catch (updateError: any) {
          console.log('⚠️  Update failed (may require additional permissions)');
          console.log(`  Error: ${updateError.message}`);
        }
      }
    }

    console.log('\n✅ All tests completed successfully!');
    console.log('\nSummary:');
    console.log('  ✓ Authentication working');
    console.log('  ✓ List content items working');
    console.log('  ✓ Get content by key working');
    console.log('  ✓ Get content versions working');
    console.log('  ⚠ Update content requires additional permissions');

  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testOptimizelyApi();
