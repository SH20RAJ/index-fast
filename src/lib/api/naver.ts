/**
 * Naver Search Advisor Code Collection API
 * Documentation: https://searchadvisor.naver.com/
 */

export async function submitToNaver(siteUrl: string, accessToken: string, urls: string[]) {
  try {
    // Naver often requires per-URL submission or small batches
    // For this beta, we'll try the collection request endpoint
    // Standard format for many regional engines is a POST with a list of URLs
    
    const response = await fetch("https://searchadvisor.naver.com/api/v1/collect/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        site: siteUrl,
        urls: urls,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      return { success: true, result };
    } else {
      const errorText = await response.text();
      return { 
        success: false, 
        error: `Naver error: ${response.status} - ${errorText.substring(0, 100)}` 
      };
    }
  } catch (error) {
    console.error("Naver Submission Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
