/**
 * Universal Ping Services (Ping-o-Matic & Pingler)
 */

export async function pingService(
  service: "pingomatic" | "pingler",
  blogName: string,
  blogUrl: string,
  apiKey?: string // Pingler requires an API key for its automated API
) {
  let endpoint = "";
  let method = "GET";
  let body: string | undefined = undefined;
  const headers: Record<string, string> = {
    "User-Agent": "IndexFast-Ping-Service/1.0",
  };

  if (service === "pingomatic") {
    // Using the XML-RPC endpoint for Ping-o-Matic
    endpoint = "http://rpc.pingomatic.com/";
    method = "POST";
    headers["Content-Type"] = "text/xml";
    body = `<?xml version="1.0"?>
<methodCall>
  <methodName>weblogUpdates.ping</methodName>
  <params>
    <param><value>${blogName}</value></param>
    <param><value>${blogUrl}</value></param>
  </params>
</methodCall>`;
  } else if (service === "pingler") {
    // Pingler API requires a key for automation
    if (!apiKey) {
      return { success: false, error: "Pingler API Key is required", service };
    }
    endpoint = `http://api.pingler.com/?act=add&key=${apiKey}&title=${encodeURIComponent(
      blogName
    )}&url=${encodeURIComponent(blogUrl)}`;
  }

  try {
    const response = await fetch(endpoint, {
      method,
      headers,
      body,
    });

    return { success: response.ok, status: response.status, service };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Error pinging ${service}:`, message);
    return { success: false, error: message, service };
  }
}

/**
 * Pings all universal services in parallel
 */
export async function pingAllUniversal(
  blogName: string,
  blogUrl: string,
  pinglerApiKey?: string
) {
  const results = await Promise.all([
    pingService("pingomatic", blogName, blogUrl),
    pingService("pingler", blogName, blogUrl, pinglerApiKey),
  ]);

  return results;
}
