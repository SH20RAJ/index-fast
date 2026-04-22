# Model Context Protocol (MCP) Support

IndexFast supports the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/), allowing AI agents (like Claude Desktop, Windsurf, or Cursor) to interact with your indexing dashboard, submit URLs, and run SEO audits directly.

## Endpoint

- **URL:** `https://www.indexfast.co/api/mcp`
- **Method:** `POST`
- **Auth:** `Authorization: Bearer <YOUR_API_KEY>`

You can find your API key in the [API Settings](https://www.indexfast.co/dashboard/api) of your dashboard.

## Features & Tools

The MCP endpoint exposes several tools that AI models can use:

### 1. `list_websites`
Returns a list of all websites connected to your IndexFast account.
- **Inputs:** None

### 2. `get_usage`
Returns your current monthly indexing usage, submission limits, and current plan details.
- **Inputs:** None

### 3. `submit_url`
Triggers an indexing request for a specific URL. 
- **Inputs:**
  - `url` (string): The full URL to index. Note: The URL's domain must already be connected to your account.

### 4. `seo_audit`
Runs a comprehensive SEO audit on a URL and returns a score, a list of issues, and recommended fix prompts.
- **Inputs:**
  - `url` (string): The full URL to audit.

### 5. `list_recent_submissions`
Shows the most recent indexing events and their current status (success/failed).
- **Inputs:**
  - `limit` (number, optional): Number of events to return. Max 50.

### 6. `get_site_details`
Returns the full configuration and status for a specific site (including Sitemap URL, Bing API keys, etc.).
- **Inputs:**
  - `siteId` (string): The unique ID of the site (can be found via `list_websites`).

## Setup in AI Clients

### Claude Desktop
Add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "indexfast": {
      "command": "curl",
      "args": [
        "-X", "POST",
        "-H", "Authorization: Bearer YOUR_API_KEY",
        "-H", "Content-Type: application/json",
        "-d", "{\"method\":\"list_tools\",\"jsonrpc\":\"2.0\",\"id\":1}",
        "https://www.indexfast.co/api/mcp"
      ]
    }
  }
}
```
*Note: The exact configuration might vary depending on how the client handles HTTP-based MCP servers. For most clients, a simple HTTP bridge or a custom script is used.*

## Benefits for Developers

- **Auto-Indexing from IDE:** Ask your AI assistant to "Index the page I just finished" without leaving your code editor.
- **SEO Debugging:** Get instant SEO feedback on your localhost or production URLs while you work.
- **Dashboard at your fingertips:** Check your usage and site status via chat.
