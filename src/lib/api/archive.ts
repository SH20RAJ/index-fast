/**
 * Archive.org (Wayback Machine) integration
 * Submit URLs to Internet Archive for permanent preservation
 */

export interface ArchiveSubmitResult {
  success: boolean;
  error?: string;
}

/**
 * Submit a URL to archive.org Wayback Machine
 * 
 * @param targetUrl - The URL to archive
 * @returns Promise with success status
 * 
 * @example
 * const result = await submitToArchiveOrg("https://example.com");
 * if (result.success) {
 *   console.log("URL archived successfully");
 * }
 */
export async function submitToArchiveOrg(targetUrl: string): Promise<ArchiveSubmitResult> {
  try {
    const archiveUrl = `https://web.archive.org/save/${encodeURIComponent(targetUrl)}`;
    
    const response = await fetch(archiveUrl, {
      method: "GET",
      redirect: "manual", // Don't follow redirects, just get the response code
      headers: {
        "User-Agent": "IndexFast/1.0 (+https://indexfast.co)",
      },
    });

    // Archive.org returns 2xx status codes for successful submissions
    if (response.status >= 200 && response.status < 400) {
      return { success: true };
    }

    // 4xx/5xx errors indicate failure
    return {
      success: false,
      error: `Archive.org returned status ${response.status}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error submitting to archive.org",
    };
  }
}
