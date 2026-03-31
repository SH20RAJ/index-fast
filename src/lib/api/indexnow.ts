/**
 * IndexNow Protocol Submission API
 * Documentation: https://www.indexnow.org/documentation
 */

export async function submitToIndexNow(
  host: string,
  key: string,
  urlList: string[],
  keyLocation?: string
) {
  if (!key) {
    throw new Error("IndexNow Key is required");
  }

  // Common IndexNow endpoints (Bing is the main aggregator)
  const endpoints = [
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow",
    "https://yandex.com/indexnow"
  ];

  const payload = {
    host,
    key,
    keyLocation: keyLocation || `https://${host}/${key}.txt`,
    urlList,
  };

  // We only need to submit to one. It will notify others.
  const targetEndpoint = endpoints[0];

  try {
    const response = await fetch(targetEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, status: response.status, error: errorText };
    }

    return { success: true, status: response.status, count: urlList.length };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: message };
  }
}
