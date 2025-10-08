# Optimizely CMS API Utility Class

A TypeScript utility class for interacting with the Optimizely CMS (SaaS) REST API.

## Features

- ✅ OAuth2 authentication with automatic token refresh
- ✅ Get content by content key
- ✅ List child content items
- ✅ Get content versions
- ✅ Create new content (requires write permissions)
- ✅ Update content (requires write permissions)
- ✅ Automatic content key normalization (removes dashes)
- ✅ Error handling with detailed error messages

## Installation

The utility class is located at `src/utils/optimizely-cms-client.ts` and uses `axios` for HTTP requests.

Dependencies:
```bash
yarn add axios
```

## Usage

### Initialize the Client

```typescript
import { OptimizelyApiClient } from './utils/optimizely-cms-client';

const client = new OptimizelyApiClient({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  baseUrl: 'https://your-instance.cms.optimizely.com'
});
```

### List Content Items

List child content items under a parent container:

```typescript
// You can use content keys with or without dashes - they're automatically normalized
const parentKey = '9fa0c716-c87e-4b8a-9898-bc2d2270ea21';

const items = await client.listContentItems(parentKey, undefined, 0, 10);

console.log(`Found ${items.totalItemCount} items`);
items.items.forEach(item => {
  console.log(`${item.locales.en.displayName} (${item.key})`);
});
```

### Get Content by Key

Retrieve a specific content item:

```typescript
const contentKey = '30b6a92668854dc8a534c3d692a20409';
const content = await client.getContentByKey(contentKey);

console.log(`Name: ${content.locales.en.displayName}`);
console.log(`Type: ${content.contentType}`);
console.log(`Status: ${content.locales.en.status}`);
```

### Get Content Versions

Retrieve all versions of a content item:

```typescript
const versions = await client.getContentVersions(contentKey);

versions.items.forEach(version => {
  console.log(`Version ${version.version}: ${version.status}`);
});
```

### Update Content

Update content properties (requires write permissions):

```typescript
const latestVersion = versions.items[0];
const versionId = parseInt(latestVersion.version);

const result = await client.updateContent(contentKey, versionId, {
  locales: {
    en: {
      displayName: 'Updated Name',
      // Add other properties to update
    }
  }
});
```

### Create New Content

Create a new content item (requires write permissions):

```typescript
const newContent = await client.createContent({
  contentType: 'ArticlePage',
  container: '9950e459-65c3-436a-896c-b4f0cad8ce01',
  displayName: 'My New Article',
  status: 'draft', // or 'published'
  locale: 'en',
  properties: {
    heading: 'Article Heading',
    // Add other properties based on your content type schema
  }
});

console.log('Created content key:', newContent.key);
```

**Example: Creating an ArticlePage**

See [src/examples/create-article-page.ts](src/examples/create-article-page.ts) for a complete example with a helper function:

```typescript
import { createArticlePageHelper } from './examples/create-article-page';

const article = await createArticlePageHelper(client, {
  title: 'My Article Title',
  heading: 'Custom Heading',
  status: 'draft',
  container: '9950e459-65c3-436a-896c-b4f0cad8ce01'
});
```

## API Methods

### `constructor(config: OptimizelyConfig)`
- `clientId`: OAuth client ID
- `clientSecret`: OAuth client secret
- `baseUrl`: Your Optimizely instance URL

### `getContentByKey(contentKey: string): Promise<any>`
Get a content item by its content key.

### `listContentItems(parentContentKey: string, contentTypes?: string[], pageIndex?: number, pageSize?: number): Promise<any>`
List child content items under a parent content key.
- `parentContentKey`: Parent container key
- `contentTypes`: Optional array of content type filters
- `pageIndex`: Page number (default: 0)
- `pageSize`: Items per page (default: 25)

### `getContentVersions(contentKey: string, locales?: string[], statuses?: string[]): Promise<any>`
Get all versions of a content item.
- `locales`: Optional locale filters (e.g., ['en', 'fr'])
- `statuses`: Optional status filters (e.g., ['draft', 'published'])

### `updateContent(contentKey: string, versionId: number, updates: any): Promise<any>`
Update a content item using JSON Merge Patch.
- `contentKey`: Content item key
- `versionId`: Version number to update
- `updates`: Object with properties to update

### `createContent(params: CreateContentParams): Promise<any>`
Create a new content item.
- `contentType`: Content type name (e.g., 'ArticlePage')
- `container`: Parent container key
- `displayName`: Display name for the content
- `locale`: Locale code (default: 'en')
- `status`: 'draft' or 'published' (default: 'draft')
- `properties`: Optional content-specific properties object

## Content Key Format

The API accepts content keys in either format:
- With dashes: `9fa0c716-c87e-4b8a-9898-bc2d2270ea21`
- Without dashes: `9fa0c716c87e4b8a9898bc2d2270ea21`

The utility class automatically normalizes keys by removing dashes.

## Error Handling

All methods throw errors with detailed messages:

```typescript
try {
  const content = await client.getContentByKey('invalid-key');
} catch (error) {
  console.error('Error:', error.message);
}
```

## Testing

Run the test script to verify the API connection:

```bash
yarn build
node build/test-api.js
```

## API Documentation

For complete API documentation, see:
- [Optimizely CMS (SaaS) REST API](https://docs.developers.optimizely.com/content-management-system/v1.0.0-CMS-SaaS/reference/introduction-to-the-cms-content-api)
- [Authentication Guide](https://docs.developers.optimizely.com/content-management-system/v1.0.0-CMS-SaaS/reference/authentication-and-authorization)

## Notes

- Authentication tokens are automatically cached and refreshed
- Tokens expire after 5 minutes (300 seconds)
- The API uses the `preview3/experimental` endpoints
- Write operations (create/update) require `api:admin` scope and appropriate content permissions
- Rate limit: 100 requests per 10 seconds per IP address
- Content keys are automatically generated (UUID without dashes) when creating new content
- The `properties` object structure depends on your content type definition

## Permissions

The current API credentials have **read-only** access. To enable content creation and updates:

1. Ensure the API key has `api:admin` scope
2. Verify the user account has write permissions for the content types and containers
3. Check that content is not locked or in a restricted workflow state
