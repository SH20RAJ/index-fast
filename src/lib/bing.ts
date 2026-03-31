/**
 * Bing Webmaster Submission API (Batch)
 * Documentation: https://learn.microsoft.com/en-us/bingwebmaster/getting-started-with-the-bing-webmaster-api
 */

export async function submitToBingBatch(
  siteUrl: string,
  urlList: string[],
  apiKey: string
) {
  if (!apiKey) {
    throw new Error("Bing API Key is required");
  }

  const endpoint = `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=${apiKey}`;

  // Bing allows up to 500 URLs per batch
  const BATCH_SIZE = 500;
  const batches = [];
  
  for (let i = 0; i < urlList.length; i += BATCH_SIZE) {
    batches.push(urlList.slice(i, i + BATCH_SIZE));
  }

  const results = await Promise.all(
    batches.map(async (batch) => {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Host: "ssl.bing.com",
          },
          body: JSON.stringify({
            siteUrl,
            urlList: batch,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          return { success: false, status: response.status, error: errorText };
        }

        return { success: true, status: response.status, count: batch.length };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    })
  );

  return results;
}
