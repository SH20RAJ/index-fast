import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/stack";

type PingResult = {
  endpoint: string;
  status: "success" | "failed";
  ms?: number;
};

// XML-RPC ping payload builder
function buildXmlRpcPayload(url: string, title: string): string {
  const safeTitle = title || url;
  return `<?xml version="1.0" encoding="UTF-8"?>
<methodCall>
  <methodName>weblogUpdates.ping</methodName>
  <params>
    <param><value><string>${safeTitle}</string></value></param>
    <param><value><string>${url}</string></value></param>
  </params>
</methodCall>`;
}

async function pingOne(endpoint: string, url: string, title: string): Promise<PingResult> {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const body = buildXmlRpcPayload(url, title);
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/xml", "User-Agent": "IndexFast/1.0" },
      body,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const ms = Date.now() - start;
    return { endpoint, status: res.ok ? "success" : "failed", ms };
  } catch {
    return { endpoint, status: "failed", ms: Date.now() - start };
  }
}

export async function POST(req: NextRequest) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { url, title = "", endpoints } = (await req.json()) as {
    url: string;
    title?: string;
    endpoints: string[];
  };

  if (!url || !Array.isArray(endpoints) || endpoints.length === 0) {
    return NextResponse.json({ error: "url and endpoints are required." }, { status: 400 });
  }

  if (endpoints.length > 120) {
    return NextResponse.json({ error: "Too many endpoints. Maximum 120 per request." }, { status: 400 });
  }

  // Fan out with concurrency cap of 10
  const CONCURRENCY = 10;
  const results: PingResult[] = [];
  for (let i = 0; i < endpoints.length; i += CONCURRENCY) {
    const batch = endpoints.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(batch.map((ep) => pingOne(ep, url, title)));
    results.push(...batchResults);
  }

  return NextResponse.json({ results });
}
