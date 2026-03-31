export interface Website {
  id: string;
  url: string;
  sitemapUrl: string;
  isPro: boolean;
  lastSyncAt: string | null;
}