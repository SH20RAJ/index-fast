/**
 * Baidu Link Submission API
 * Documentation: https://ziyuan.baidu.com/linksubmit/index
 */

export async function submitToBaidu(siteUrl: string, token: string, urls: string[]) {
  try {
    const url = new URL(siteUrl);
    const domain = url.hostname;
    
    const baiduApiUrl = `http://data.zz.baidu.com/urls?site=${domain}&token=${token}`;
    
    const response = await fetch(baiduApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: urls.join("\n"),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      return { success: true, count: result.success, remain: result.remain };
    } else {
      return { 
        success: false, 
        error: result.message || `Baidu error: ${response.status}`,
        code: result.error
      };
    }
  } catch (error) {
    console.error("Baidu Submission Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
