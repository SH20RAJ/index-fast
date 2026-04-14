/**
 * Yandex Webmaster API
 * Documentation: https://yandex.com/support/webmaster/api/index.html
 */

export async function submitToYandex(siteUrl: string, token: string, urls: string[]) {
  try {
    const headers = {
      "Authorization": `OAuth ${token}`,
      "Content-Type": "application/json",
    };

    // 1. Get User ID
    const userResponse = await fetch("https://api.webmaster.yandex.net/v4/user/", { headers });
    if (!userResponse.ok) {
      throw new Error(`Failed to get Yandex User ID: ${userResponse.status}`);
    }
    const userData = await userResponse.json();
    const userId = userData.user_id;

    // 2. List Hosts to find the host_id for our site
    const hostsResponse = await fetch(`https://api.webmaster.yandex.net/v4/user/${userId}/hosts/`, { headers });
    if (!hostsResponse.ok) {
      throw new Error(`Failed to list Yandex hosts: ${hostsResponse.status}`);
    }
    const hostsData = await hostsResponse.json();
    
    // Normalize siteUrl for comparison (strip trailing slash)
    const normalizedSiteUrl = siteUrl.replace(/\/$/, "").toLowerCase();
    const host = hostsData.hosts.find((h: any) => 
      h.unicode_host_url.replace(/\/$/, "").toLowerCase() === normalizedSiteUrl ||
      h.ascii_host_url.replace(/\/$/, "").toLowerCase() === normalizedSiteUrl
    );

    if (!host) {
      throw new Error(`Site ${siteUrl} not found in your Yandex Webmaster account.`);
    }

    const hostId = host.host_id;

    // 3. Submit URLs for recrawl
    // Yandex API usually accepts one URL per request for recrawl queue
    const results = await Promise.all(urls.map(async (url) => {
      const recrawlResponse = await fetch(
        `https://api.webmaster.yandex.net/v4/user/${userId}/hosts/${hostId}/recrawl/queue/`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ url }),
        }
      );
      
      return {
        url,
        success: recrawlResponse.ok,
        status: recrawlResponse.status,
      };
    }));

    const allSuccessful = results.every(r => r.success);
    
    return { 
      success: allSuccessful, 
      results,
      hostId 
    };

  } catch (error) {
    console.error("Yandex Submission Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
