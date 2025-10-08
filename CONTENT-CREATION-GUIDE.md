# Creating ArticlePage Content via API

This guide shows how to create new ArticlePage content under container `9950e45965c3436a896cb4f0cad8ce01` using the Optimizely CMS API.

## Quick Start

```typescript
import { OptimizelyApiClient } from './utils/optimizely-cms-client';

const client = new OptimizelyApiClient({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  baseUrl: 'https://your-instance.cms.optimizely.com'
});

// Create an ArticlePage - container must be WITHOUT dashes
const article = await client.createContent({
  contentType: 'ArticlePage',
  container: '9950e45965c3436a896cb4f0cad8ce01', // No dashes!
  displayName: 'My New Article',
  status: 'draft',
  locale: 'en',
  properties: {
    Heading: 'Article Heading',
    SubHeading: 'Article sub-heading',
    Author: 'John Doe',
    Body: 'Article content here...',
    SeoSettings: {
      GraphType: 'article', // REQUIRED: Must be 'article' or '-'
      MetaTitle: 'SEO Title',
      MetaDescription: 'SEO description'
    }
  }
});

console.log('Created article:', article.key);
```

## Using the Helper Function

For easier article creation, use the helper function:

```typescript
import { OptimizelyApiClient } from './utils/optimizely-cms-client';
import { createArticlePageHelper } from './examples/create-article-page';

const client = new OptimizelyApiClient({ /* ... */ });

const article = await createArticlePageHelper(client, {
  title: 'My Article Title',
  heading: 'Optional custom heading',
  subHeading: 'Optional sub-heading',
  author: 'John Doe',
  body: 'Article content...',
  status: 'draft', // or 'published'
  seoSettings: {
    metaTitle: 'Custom SEO Title',
    metaDescription: 'Custom SEO description',
    graphType: 'article' // Optional, defaults to 'article'
  }
});
```

## Container Information

- **Container ID**: `9950e45965c3436a896cb4f0cad8ce01` (WITHOUT dashes)
- **Content Type**: `ArticlePage`
- **Status**: ✅ Working - Content creation successful!

## Required Properties

### SeoSettings (Component - REQUIRED)

The `SeoSettings.GraphType` field is **required** for ArticlePage:

```typescript
SeoSettings: {
  GraphType: 'article', // Required: must be 'article' or '-'
  MetaTitle: 'Optional meta title',
  MetaDescription: 'Optional meta description'
}
```

### Other ArticlePage Properties

All other properties are **optional**:

- `Heading` (string): Page heading
- `SubHeading` (string): Page sub-heading
- `Author` (string): Article author name
- `AuthorEmail` (string): Author email address
- `Body` (richText): Main article content
- `PromoImage` (contentReference): Promotional image
- `PageAdminSettings` (component): Admin settings

## API Response

When successful, the API returns:

```json
{
  "key": "09cefb99e9862b6abe3831e1d361e0f2",
  "locale": "en",
  "version": "383",
  "contentType": "ArticlePage",
  "displayName": "Test Article Created via API",
  "status": "draft",
  "container": "9950e45965c3436a896cb4f0cad8ce01",
  "routeSegment": "test-article-created-via-api2",
  "lastModified": "2025-10-08T12:56:57.6310994+00:00",
  "properties": {
    "Heading": "Welcome to My Test Article",
    "SubHeading": "This article was created using the Optimizely CMS API",
    "Author": "API Test User",
    "Body": "This is the body content of the test article.",
    "SeoSettings": {
      "MetaTitle": "Test Article - Created via API",
      "MetaDescription": "This is a test article created using the Optimizely CMS API",
      "GraphType": "article"
    }
  }
}
```

## Important Notes

1. **Container Key Format**: The container must be provided **without dashes**
   - ✅ Correct: `9950e45965c3436a896cb4f0cad8ce01`
   - ❌ Wrong: `9950e459-65c3-436a-896c-b4f0cad8ce01`

2. **Property Names**: Use PascalCase (capital first letter)
   - ✅ Correct: `Heading`, `SubHeading`, `SeoSettings`
   - ❌ Wrong: `heading`, `subheading`, `seoSettings`

3. **Required Field**: `SeoSettings.GraphType` must be included

4. **Permissions**: Requires API credentials with CREATE permissions

## Testing

Test the content creation:

```bash
yarn build
node build/test-create-content.js
```

This will:
1. Fetch the ArticlePage content type structure
2. Verify the container exists
3. Create a test article
4. Verify the created content

## Complete Example

See [src/examples/create-article-page.ts](src/examples/create-article-page.ts) for a complete, working example with the helper function.

## Next Steps

After creating content, you can:

1. **Retrieve it**: `await client.getContentByKey(article.key)`
2. **Update it**: `await client.updateContent(article.key, versionId, updates)`
3. **List container contents**: `await client.listContentItems(containerKey)`
4. **Get versions**: `await client.getContentVersions(article.key)`

## Troubleshooting

**400 Bad Request - "Property 'OpenGraph Type' is required"**
- You must include `SeoSettings.GraphType` in the properties
- Set it to `'article'` or `'-'`

**403 Forbidden Error**
- Verify API credentials have CREATE permissions (not just UPDATE)
- Check user has create rights for ArticlePage

**404 Not Found Error**
- Verify container key is correct and without dashes
- Check container exists in your CMS instance

**Property Errors**
- Ensure property names use PascalCase (e.g., `Heading` not `heading`)
- Verify properties match ArticlePage schema

For more details, see [README-OPTIMIZELY-API.md](README-OPTIMIZELY-API.md).
