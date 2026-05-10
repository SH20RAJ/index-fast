import { NextRequest, NextResponse } from "next/server";

const NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      console.error("NVIDIA_API_KEY not configured");
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 500 }
      );
    }

    // Add system message for context about IndexFast
    const systemMessage: Message = {
      role: "user",
      content: `You are a helpful assistant for IndexFast, an automated SEO indexing and URL submission service. 
      IndexFast helps websites get indexed faster by:
      - Submitting URLs to Google, Bing, and IndexNow instantly
      - Automating sitemap sync
      - Providing dashboard analytics
      - Supporting 4-24 hour discovery windows
      - Maintaining 99.95% uptime
      
      Be friendly, concise, and helpful. Focus on answering questions about SEO indexing, URL submission, and IndexFast features.`,
    };

    const fullMessages = [systemMessage, ...messages];

    const response = await fetch(NVIDIA_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen/qwen3-coder-480b-a35b-instruct",
        messages: fullMessages,
        temperature: 0.7,
        top_p: 0.8,
        max_tokens: 1024,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("NVIDIA API error:", error);
      return NextResponse.json(
        { error: "Failed to get AI response" },
        { status: 500 }
      );
    }

    // Stream the response
    const reader = response.body?.getReader();
    if (!reader) {
      return NextResponse.json(
        { error: "No response stream" },
        { status: 500 }
      );
    }

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const decoder = new TextDecoder();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") {
                  controller.close();
                  return;
                }
                try {
                  const json = JSON.parse(data);
                  // Only send chunks that have content in delta
                  if (json.choices?.[0]?.delta?.content) {
                    controller.enqueue(new TextEncoder().encode(line + "\n"));
                  } else if (data === "[DONE]" || json.choices?.[0]?.finish_reason === "stop") {
                    controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
                    controller.close();
                    return;
                  }
                } catch (e) {
                  console.error("Error parsing chunk:", e);
                }
              }
            }
          }
          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
