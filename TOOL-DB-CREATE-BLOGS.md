# db_create_blogs Tool

Creates a new ArticlePage in the Optimizely CMS using content provided by an Opal agent.

## Tool Information

- **Name**: `db_create_blogs`
- **Type**: Opal Tool
- **Content Type**: ArticlePage
- **Default Container**: `9950e45965c3436a896cb4f0cad8ce01`

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `heading` | String | Yes | The heading of the article |
| `subheading` | String | Yes | The subheading of the article |
| `body` | String | Yes | The main body content of the article |
| `author` | String | No | The author name (defaults to "Opal Agent") |
| `container` | String | No | Container key without dashes (defaults to article container) |

## Response Format

### Success Response

```json
{
  "success": true,
  "contentKey": "5ba6bc9b61cb6210bd0871e85f0905bc",
  "displayName": "Article Heading",
  "contentType": "ArticlePage",
  "status": "draft",
  "version": "391",
  "routeSegment": "article-heading",
  "lastModified": "2025-10-08T13:00:00Z",
  "message": "Successfully created article: \"Article Heading\"",
  "url": "https://app-epsadabuoas7yk1mp001.cms.optimizely.com/content/5ba6bc9b61cb6210bd0871e85f0905bc",
  "properties": {
    "heading": "Article Heading",
    "subheading": "Article subheading",
    "author": "Opal Agent",
    "body": "Article body content..."
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message details",
  "message": "Failed to create article: Error message details"
}
```

## Features

- ✅ Creates ArticlePage content type
- ✅ Automatically configures SEO settings (GraphType: 'article')
- ✅ Sets MetaTitle and MetaDescription from heading/subheading
- ✅ Creates content in draft status
- ✅ Returns direct CMS URL to the created content
- ✅ Handles errors gracefully with detailed messages

## SEO Settings

The tool automatically configures SEO settings:

- **GraphType**: Set to `'article'` (required for ArticlePage)
- **MetaTitle**: Uses the heading
- **MetaDescription**: Uses the subheading (or heading if subheading not provided)

## Example Usage via API

```bash
curl -u admin:password -X POST http://localhost:3000/tools/db_create_blogs \
  -H "Content-Type: application/json" \
  -d '{
    "heading": "My New Article",
    "subheading": "An article created by Opal Agent",
    "body": "This is the full article content...",
    "author": "AI Assistant"
  }'
```

## Testing

Run the test script:

```bash
yarn build
node build/test-db-create-blogs.js
```

## Implementation

- **Location**: [src/tools/db_create_blogs.ts](src/tools/db_create_blogs.ts)
- **Uses**: OptimizelyApiClient from [src/utils/optimizely-cms-client.ts](src/utils/optimizely-cms-client.ts)
- **Registered**: [src/main.ts](src/main.ts:30)

## Notes

- Content is created in **draft** status
- Container key must be provided **without dashes**
- All ArticlePage required fields are automatically populated
- Author defaults to "Opal Agent" if not provided
- The tool handles the required SeoSettings.GraphType field automatically
