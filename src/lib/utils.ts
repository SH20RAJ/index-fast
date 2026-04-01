import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toAbsoluteSiteUrl(input: string): string {
  const raw = input.trim()
  if (!raw) {
    return ""
  }

  try {
    return new URL(raw).toString()
  } catch {
    try {
      return new URL(`https://${raw}`).toString()
    } catch {
      return ""
    }
  }
}

export function buildBingIndexNowPortalUrl(siteUrl: string): string {
  const normalized = toAbsoluteSiteUrl(siteUrl)
  const target = normalized || siteUrl
  return `https://www.bing.com/webmasters/indexnow?siteUrl=${encodeURIComponent(target)}`
}

export function buildGoogleSearchConsolePropertyUrl(siteUrl: string): string {
  const normalized = toAbsoluteSiteUrl(siteUrl)
  const target = normalized || siteUrl
  return `https://search.google.com/search-console?resource_id=${encodeURIComponent(target)}`
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
