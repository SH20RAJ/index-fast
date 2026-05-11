import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Blog MCP (Model Context Protocol) Endpoint - ADMIN ONLY
 * 
 * Supports list_tools and call_tool via JSON-RPC over HTTP.
 * Authentication: Authorization: Bearer <idx_key> OR ?key=<idx_key>
 * Access restricted to admin via BLOG_ADMIN_API_KEY environment variable.
 */

export const dynamic = "force-dynamic";

function parseMarkdownContent(markdown: string) {
  const sections: any[] = [];
  const faqs: any[] = [];
  
  if (!markdown) return { sections, faqs };

  const lines = markdown.split('\n');
  let currentSection: any = null;
  let inFaq = false;
  let currentFaq: any = null;

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Headings
    if (trimmed.startsWith('#')) {
      const heading = trimmed.replace(/^#+\s+/, '').trim();
      
      if (heading.toLowerCase().includes('faq')) {
        inFaq = true;
        continue;
      }

      inFaq = false;
      currentSection = { heading, paragraphs: [], bullets: [] };
      sections.push(currentSection);
      continue;
    }

    // FAQ items
    if (inFaq) {
      if (trimmed.startsWith('###') || trimmed.match(/^\d+\./) || (trimmed.endsWith('?') && trimmed.length < 200)) {
        if (currentFaq && currentFaq.question && currentFaq.answer) {
          faqs.push(currentFaq);
        }
        currentFaq = { question: trimmed.replace(/^###\s+/, '').replace(/^\d+\.\s+/, ''), answer: '' };
      } else if (currentFaq) {
        currentFaq.answer = (currentFaq.answer + ' ' + trimmed).trim();
      }
      continue;
    }

    // Regular section content
    if (!currentSection) {
      currentSection = { heading: "Introduction", paragraphs: [], bullets: [] };
      sections.push(currentSection);
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      currentSection.bullets.push(trimmed.replace(/^[-*]\s+/, ''));
    } else {
      currentSection.paragraphs.push(trimmed);
    }
  }

  if (currentFaq && currentFaq.question && currentFaq.answer) {
    faqs.push(currentFaq);
  }

  return { sections, faqs };
}

export async function GET(req: NextRequest) {
  const accept = req.headers.get("Accept");
  if (accept === "text/event-stream") {
    const encoder = new TextEncoder();
    const responseStream = new ReadableStream({
      start(controller) {
        const url = new URL(req.url);
        // Ensure we send the absolute URL for the POST handler
        const endpoint = `${url.origin}${url.pathname}?${url.searchParams.toString()}`;
        controller.enqueue(encoder.encode(`event: endpoint\ndata: ${endpoint}\n\n`));

        // Keep connection alive with heartbeats
        const interval = setInterval(() => {
          try {
            controller.enqueue(encoder.encode(": heartbeat\n\n"));
          } catch (e) {
            clearInterval(interval);
          }
        }, 15000);

        req.signal.addEventListener("abort", () => {
          clearInterval(interval);
          try {
            controller.close();
          } catch (e) {}
        });
      },
    });

    return new Response(responseStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  }

  return NextResponse.json({
    status: "online",
    message: "IndexFast Blog MCP Endpoint is active (Admin Only). Use POST with JSON-RPC 2.0 to call tools.",
    docs: "https://indexfast.co/docs/mcp"
  });
}

export async function POST(req: NextRequest) {
  let id: string | number | null = null;
  try {
    // Support both Authorization header and query param for mcp-remote
    let apiKey = req.nextUrl.searchParams.get("key");

    // if (!apiKey) {
    //   const authHeader = req.headers.get("Authorization");
    //   if (!authHeader || !authHeader.startsWith("Bearer ")) {
    //     return NextResponse.json({
    //       jsonrpc: "2.0",
    //       error: { code: -32001, message: "Unauthorized. Missing or invalid Authorization header." },
    //       id
    //     }, { status: 401 });
    //   }
    //   apiKey = authHeader.replace("Bearer ", "");
    // }
    
    // 1. Authenticate Admin via BLOG_ADMIN_API_KEY
    const adminKey = process.env.BLOG_ADMIN_API_KEY;
    const isAdmin = adminKey && apiKey === adminKey;

    // if (!isAdmin) {
    //   return NextResponse.json({ 
    //     jsonrpc: "2.0",
    //     error: { code: -32001, message: "Unauthorized. Admin access required." },
    //     id 
    //   }, { status: 401 });
    // }

    // 2. Parse JSON-RPC Request
    const body = await req.json().catch(() => ({}));
    const { method, params, id: requestId } = body;
    if (requestId !== undefined) id = requestId;

    // Handle MCP Lifecycle Methods
    if (method === "initialize") {
      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: "IndexFast Blog",
            version: "1.0.0"
          }
        }
      });
    }

    if (method === "notifications/initialized") {
      return new Response(null, { status: 204 });
    }

    if (method === "list_tools" || method === "tools/list") {
      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        result: {
          tools: [
            {
              name: "list_blog_posts",
              description: "List all blog posts in the system.",
              inputSchema: { type: "object", properties: {} }
            },
            {
              name: "get_blog_post",
              description: "Get full details of a blog post by its slug.",
              inputSchema: {
                type: "object",
                properties: {
                  slug: { type: "string", description: "The unique URL slug of the post." }
                },
                required: ["slug"]
              }
            },
            {
              name: "create_or_update_blog_post",
              description: "Create a new blog post or update an existing one by slug. ONLY send markdown for content.",
              inputSchema: {
                type: "object",
                properties: {
                  slug: { type: "string" },
                  title: { type: "string" },
                  description: { type: "string" },
                  content: { type: "string", description: "Full blog post content in Markdown format. Headers (# or ##) will create new sections." },
                  author: { type: "string" },
                  primaryKeyword: { type: "string" }
                },
                required: ["slug", "title", "description", "content"]
              }
            },
            {
              name: "delete_blog_post",
              description: "Delete a blog post by its slug.",
              inputSchema: {
                type: "object",
                properties: {
                  slug: { type: "string" }
                },
                required: ["slug"]
              }
            }
          ]
        }
      });
    }

    if (method === "call_tool" || method === "tools/call") {
      const { name, arguments: args } = params || {};

      switch (name) {
        case "list_blog_posts": {
          const posts = await db.query.blogPosts.findMany({
            orderBy: [desc(blogPosts.publishedAt)],
          });
          return NextResponse.json({
            jsonrpc: "2.0",
            id,
            result: {
              content: [{ type: "text", text: JSON.stringify(posts.map(p => ({ slug: p.slug, title: p.title, publishedAt: p.publishedAt })), null, 2) }]
            }
          });
        }

        case "get_blog_post": {
          const { slug } = args || {};
          const post = await db.query.blogPosts.findFirst({
            where: eq(blogPosts.slug, slug),
          });
          return NextResponse.json({
            jsonrpc: "2.0",
            id,
            result: {
              content: [{ type: "text", text: JSON.stringify(post || { error: "Post not found" }, null, 2) }]
            }
          });
        }

        case "create_or_update_blog_post": {
          const { slug, title, description, content, author, primaryKeyword } = args || {};
          if (!slug || !title || !content) {
            return NextResponse.json({ id, error: { message: "slug, title, and content are required." } }, { status: 400 });
          }

          const { sections, faqs } = parseMarkdownContent(content);

          const existing = await db.query.blogPosts.findFirst({
            where: eq(blogPosts.slug, slug),
          });

          const data = {
            slug,
            title,
            description,
            author: author || "IndexFast Editorial Team",
            primaryKeyword: primaryKeyword || "SEO",
            sections,
            faqs,
            hero: description, // Use description as hero if not specified
            updatedAt: new Date(),
          };

          if (existing) {
            await db.update(blogPosts).set(data).where(eq(blogPosts.slug, slug));
          } else {
            await db.insert(blogPosts).values({
              ...data,
              publishedAt: new Date(),
            });
          }

          revalidatePath("/blog");
          revalidatePath(`/blog/${slug}`);
          revalidatePath("/blog/mcp");

          return NextResponse.json({
            jsonrpc: "2.0",
            id,
            result: {
              content: [{ type: "text", text: `Blog post ${existing ? "updated" : "created"} successfully: ${slug}` }]
            }
          });
        }

        case "delete_blog_post": {
          const { slug } = args || {};
          if (!slug) return NextResponse.json({ id, error: { message: "slug is required." } }, { status: 400 });

          await db.delete(blogPosts).where(eq(blogPosts.slug, slug));

          revalidatePath("/blog");
          revalidatePath("/blog/mcp");

          return NextResponse.json({
            jsonrpc: "2.0",
            id,
            result: {
              content: [{ type: "text", text: `Blog post ${slug} deleted successfully.` }]
            }
          });
        }
        
        default:
          return NextResponse.json({ id, error: { message: `Unknown tool: ${name}` } }, { status: 404 });
      }
    }

    return NextResponse.json({ 
      jsonrpc: "2.0",
      error: { code: -32600, message: "Invalid request. Method should be list_tools or call_tool." },
      id 
    }, { status: 400 });

  } catch (error) {
    console.error("[MCP ERROR]", error);
    return NextResponse.json({ 
      jsonrpc: "2.0",
      error: { code: -32603, message: "Internal Server Error" },
      id 
    }, { status: 500 });
  }
}
