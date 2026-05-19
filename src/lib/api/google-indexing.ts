/**
 * Google Indexing API Integration
 *
 * Uses Google Indexing API v3 with service account credentials
 * to submit URLs for indexing via Google Search Console.
 *
 * Setup:
 * 1. Create a Google Cloud project and enable the Indexing API
 * 2. Create a service account with JSON key
 * 3. Add the service account email as an owner in Google Search Console
 * 4. Store the JSON key in the website's gscServiceAccountKey field
 */

import { google } from "googleapis";

interface IndexingResult {
  success: boolean;
  url?: string;
  type?: string;
  notifyTime?: string;
  error?: string;
}

/**
 * Submit a URL to Google Indexing API using service account credentials
 */
export async function submitToGoogleIndexing(
  url: string,
  serviceAccountKeyJson: string,
  type: "URL_UPDATED" | "URL_DELETED" = "URL_UPDATED"
): Promise<IndexingResult> {
  try {
    const credentials = JSON.parse(serviceAccountKeyJson);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/indexing"],
    });

    const indexing = google.indexing({ version: "v3", auth });

    const response = await indexing.urlNotifications.publish({
      requestBody: {
        url,
        type,
      },
    });

    return {
      success: true,
      url: response.data.urlNotificationMetadata?.latestUpdate?.url || url,
      type: response.data.urlNotificationMetadata?.latestUpdate?.type || type,
      notifyTime: response.data.urlNotificationMetadata?.latestUpdate?.notifyTime || undefined,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: message };
  }
}

/**
 * Submit multiple URLs to Google Indexing API (batch, respects rate limits)
 */
export async function submitBatchToGoogleIndexing(
  urls: string[],
  serviceAccountKeyJson: string,
  type: "URL_UPDATED" | "URL_DELETED" = "URL_UPDATED"
): Promise<IndexingResult[]> {
  const results: IndexingResult[] = [];

    // Google Indexing API has a rate limit of 200 requests per minute
    // We'll process with a small delay between requests
    for (const url of urls) {
      const result = await submitToGoogleIndexing(url, serviceAccountKeyJson, type);
      results.push(result);

      // Small delay to respect rate limits
      if (urls.indexOf(url) < urls.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 350));
      }
    }

  return results;
}

/**
 * Check if a service account key JSON is valid
 */
export function validateServiceAccountKey(keyJson: string): { valid: boolean; error?: string; clientEmail?: string } {
  try {
    const parsed = JSON.parse(keyJson);
    if (!parsed.client_email || !parsed.private_key || !parsed.type || parsed.type !== "service_account") {
      return { valid: false, error: "Invalid service account key format. Must be a service account JSON key." };
    }
    return { valid: true, clientEmail: parsed.client_email };
  } catch {
    return { valid: false, error: "Invalid JSON format." };
  }
}
