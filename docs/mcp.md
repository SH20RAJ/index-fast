# Model Context Protocol (MCP) Support

IndexFast supports the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/), allowing AI agents (like Claude Desktop, Windsurf, or Cursor) to interact with your indexing dashboard and manage your blog content directly.

## Endpoints

IndexFast provides two dedicated MCP endpoints for different management tasks:

### 1. Core Indexing MCP
- **URL:** `https://www.indexfast.co/api/mcp`
- **Purpose:** Manage websites, submit URLs for indexing, and run SEO audits.
- **Auth:** `?key=<YOUR_API_KEY>` or `Authorization: Bearer <YOUR_API_KEY>`

### 2. Blog Management MCP
- **URL:** `https://www.indexfast.co/api/blog/mcp`
- **Purpose:** Full CRUD operations for your IndexFast blog.
- **Auth:** `?key=<YOUR_API_KEY>` or `Authorization: Bearer <YOUR_API_KEY>`

You can find your API key in the [Settings](https://www.indexfast.co/settings) of your dashboard.

## Connection Options

### SSE (Recommended)
Both endpoints support the standard **SSE (Server-Sent Events)** transport, which is the easiest way to connect to modern AI tools like Cursor, Windsurf, or `mcp-remote`.

**Example for Cursor/Windsurf:**
Use the SSE transport with the following URL:
`https://www.indexfast.co/api/mcp?key=YOUR_API_KEY`

### npx mcp-remote
You can test the connectivity and tools using `mcp-remote`:
```bash
npx mcp-remote https://www.indexfast.co/api/blog/mcp?key=YOUR_API_KEY
```

## Features & Tools

### Core Indexing Tools (`/api/mcp`)

1. **`list_websites`**: Returns a list of all websites connected to your account.
2. **`add_website`**: Add a new site (URL and optional sitemap).
3. **`update_website`**: Update site config (API keys, sitemap, etc.).
4. **`delete_website`**: Remove a site from your dashboard.
5. **`submit_url`**: Trigger indexing for a specific URL.
6. **`seo_audit`**: Run an SEO audit and get fix prompts.
7. **`get_usage`**: Check your monthly limits and usage.

### Blog Management Tools (`/api/blog/mcp`)

1. **`list_blog_posts`**: List all existing blog post slugs and titles.
2. **`get_blog_post`**: Get full details, metadata, and sections of a post.
3. **`create_or_update_blog_post`**: Create new posts or update existing ones. Supports Markdown content or JSON-structured sections.
4. **`delete_blog_post`**: Remove a post and revalidate the site.

## Setup in AI Clients

### Claude Desktop
Add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "indexfast-core": {
      "url": "https://www.indexfast.co/api/mcp?key=YOUR_API_KEY"
    },
    "indexfast-blog": {
      "url": "https://www.indexfast.co/api/blog/mcp?key=YOUR_API_KEY"
    }
  }
}
```

## Benefits for Developers

- **Auto-Indexing from IDE:** Ask your AI assistant to "Index the page I just finished" without leaving your code editor.
- **Content Management via Chat:** Draft, edit, and publish blog posts using simple natural language commands.
- **SEO Debugging:** Get instant SEO feedback on your URLs while you work.
