/**
 * Archive.org (Wayback Machine) integration
 * Submit URLs to Internet Archive for permanent preservation
 */

export interface ArchiveSubmitResult {
  success: boolean;
  error?: string;
}

/**
 * Submit a URL to archive.org Wayback Machine using SPN 2.0 API
 * 
 * @param targetUrl - The URL to archive
 * @returns Promise with success status and potential error
 */
export async function submitToArchiveOrg(targetUrl: string): Promise<ArchiveSubmitResult> {
  try {
    const accessKey = process.env.WAYBACK_ACCESS_KEY;
    const secretKey = process.env.WAYBACK_SECRET_KEY;
    
    // We use SPN 2.0 POST endpoint
    const endpoint = "https://web.archive.org/save";
    
    // Construct form data
    const formData = new URLSearchParams();
    formData.append("url", targetUrl);
    formData.append("capture_all", "1"); // Capture errors and redirects
    formData.append("skip_first_archive", "1"); // Save even if already exists recently
    
    const headers: Record<string, string> = {
      "User-Agent": "IndexFast/1.0 (+https://indexfast.co)",
      "Accept": "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    };

    // Add S3 Authentication if keys are available
    if (accessKey && secretKey) {
      headers["Authorization"] = `LOW ${accessKey}:${secretKey}`;
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: formData.toString(),
      redirect: "follow",
    });

    // If we requested JSON, check the response
    if (response.headers.get("content-type")?.includes("application/json")) {
      const data = await response.json();
      
      if (response.ok) {
        return { success: true };
      }

      return {
        success: false,
        error: data.message || data.error || `Archive.org error: ${response.status}`,
      };
    }

    // Fallback for non-JSON responses
    if (response.status >= 200 && response.status < 400) {
      return { success: true };
    }

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
