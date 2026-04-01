import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Add UTM parameters to a URL for tracking campaign engagement
 * @param url - The base URL
 * @param source - UTM source (e.g., "indexfast")
 * @param medium - UTM medium (e.g., "toolbox")
 * @param campaign - UTM campaign (e.g., "launch-platforms")
 * @param content - UTM content (e.g., platform name)
 */
export function addUtmParams(
  url: string,
  source: string,
  medium: string,
  campaign: string,
  content?: string
): string {
  try {
    const urlObj = new URL(url)
    urlObj.searchParams.set("utm_source", source)
    urlObj.searchParams.set("utm_medium", medium)
    urlObj.searchParams.set("utm_campaign", campaign)
    if (content) {
      urlObj.searchParams.set("utm_content", content)
    }
    return urlObj.toString()
  } catch {
    // If URL is invalid, return the original URL
    return url
  }
}
