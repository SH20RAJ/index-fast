"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import Link from "next/link";
import PageHeader from "@/components/dashboard/PageHeader";

type SubmitMode = "sitemap" | "urls";

interface SiteOption {
  id: string;
  url: string;
  sitemapUrl: string | null;
}

interface SiteUrlManagerViewProps {
  sites: SiteOption[];
  initialSiteId: string | null;
}

interface SiteUrlsPayload {
  website: {
    id: string;
    url: string;
    sitemapUrl: string | null;
    indexNowKey: string | null;
    bingApiKey: string | null;
    lastSyncAt: string | null;
  };
  sitemaps: {
    primary: string | null;
    discovered: string[];
    candidates: string[];
  };
  inventory: {
    total: number;
    urls: Array<{
      id: string;
      url: string;
      isIndexed: boolean | null;
      lastDetectedAt: string | null;
      lastSubmittedAt: string | null;
    }>;
  };
  recentSubmissions: Array<{
    id: string;
    engine: "indexnow" | "bing" | "google" | "pingomatic" | "pingler";
    status: "success" | "failed" | "pending";
    url: string;
    createdAt: string | null;
  }>;
  stats: Array<{
    engine: string;
    total: number;
    success: number;
    failed: number;
  }>;
  sitemapPreview: {
    count: number;
    urls: string[];
    error?: string;
  };
}

interface SubmitResponse {
  totalUrls: number;
  logs: string[];
  stats: {
    indexNow: {
      enabled: boolean;
      batches: number;
      successBatches: number;
      failedBatches: number;
      submittedUrls: number;
    };
    bing: {
      enabled: boolean;
      batches: number;
      successBatches: number;
      failedBatches: number;
      submittedUrls: number;
    };
    insertedInventoryUrls: number;
  };
}

export default function SiteUrlManagerView({ sites, initialSiteId }: SiteUrlManagerViewProps) {
  const [siteId, setSiteId] = useState<string>(initialSiteId ?? "");
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState<SiteUrlsPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [mode, setMode] = useState<SubmitMode>("sitemap");
  const [manualUrls, setManualUrls] = useState("");
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitResponse | null>(null);

  useEffect(() => {
    if (!siteId) {
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`/api/websites/${siteId}/urls`, { cache: "no-store" })
      .then(async (res) => {
        const data = (await res.json()) as SiteUrlsPayload | { error?: string };
        if (!res.ok) {
          throw new Error((data as { error?: string }).error || "Failed to load site URLs.");
        }
        setPayload(data as SiteUrlsPayload);
        setSitemapUrl((data as SiteUrlsPayload).sitemaps.primary ?? "");
      })
      .catch((err) => {
        setPayload(null);
        setError(err instanceof Error ? err.message : "Failed to load site URLs.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [siteId]);

  const statsMap = useMemo(() => {
    const map = new Map<string, { total: number; success: number; failed: number }>();
    payload?.stats.forEach((entry) => {
      map.set(entry.engine, entry);
    });
    return map;
  }, [payload]);

  async function handleSubmit() {
    if (!siteId) {
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    setSubmitResult(null);

    try {
      const response = await fetch(`/api/websites/${siteId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          sitemapUrl: mode === "sitemap" ? sitemapUrl : undefined,
          urls: mode === "urls" ? manualUrls : undefined,
        }),
      });

      const data = (await response.json()) as SubmitResponse | { error?: string };
      if (!response.ok) {
        throw new Error((data as { error?: string }).error || "Submission failed.");
      }

      setSubmitResult(data as SubmitResponse);

      const refreshed = await fetch(`/api/websites/${siteId}/urls`, { cache: "no-store" });
      if (refreshed.ok) {
        const nextPayload = (await refreshed.json()) as SiteUrlsPayload;
        setPayload(nextPayload);
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sites.length === 0) {
    return (
      <Box sx={{ pt: 2, pb: 8 }}>
        <Stack spacing={3}>
          <PageHeader
            title="Site URLs"
            description="Inspect sitemaps, URL inventory, and push manual submissions."
          />
          <Card sx={{ borderRadius: "16px", border: "1px dashed", borderColor: "divider", boxShadow: "none" }}>
            <CardContent sx={{ py: 7, textAlign: "center" }}>
              <Typography variant="h6" fontWeight={900}>No websites found</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Add a website first to inspect URLs and submit to IndexNow/Bing.
              </Typography>
              <Button component={Link} href="/sites" variant="contained" sx={{ textTransform: "none", borderRadius: "10px", fontWeight: 800 }}>
                Go to Websites
              </Button>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ pt: 2, pb: 8 }}>
      <Stack spacing={3}>
        <PageHeader
          title="Site URLs"
          description="List sitemap URLs, inspect inventory, and manually submit sitemap or URL lists."
          action={
            <TextField
              select
              size="small"
              value={siteId}
              onChange={(event) => setSiteId(event.target.value)}
              sx={{ minWidth: 320 }}
            >
              {sites.map((site) => (
                <MenuItem key={site.id} value={site.id}>{site.url}</MenuItem>
              ))}
            </TextField>
          }
        />

        {error ? <Alert severity="error">{error}</Alert> : null}

        {loading ? (
          <Stack direction="row" alignItems="center" spacing={1}>
            <CircularProgress size={18} />
            <Typography variant="body2" color="text.secondary">Loading site details...</Typography>
          </Stack>
        ) : null}

        {payload ? (
          <>
            <Card sx={{ borderRadius: "16px", border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
              <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  <Chip label={`Inventory: ${payload.inventory.total}`} sx={{ borderRadius: "8px", fontWeight: 700 }} />
                  <Chip
                    label={`Sitemap URLs: ${payload.sitemapPreview.count}`}
                    color={payload.sitemapPreview.count > 0 ? "primary" : "default"}
                    sx={{ borderRadius: "8px", fontWeight: 700 }}
                  />
                  <Chip
                    label={payload.website.indexNowKey ? "IndexNow key set" : "No IndexNow key"}
                    color={payload.website.indexNowKey ? "success" : "default"}
                    sx={{ borderRadius: "8px", fontWeight: 700 }}
                  />
                  <Chip
                    label={payload.website.bingApiKey ? "Bing key set" : "No Bing key"}
                    color={payload.website.bingApiKey ? "success" : "default"}
                    sx={{ borderRadius: "8px", fontWeight: 700 }}
                  />
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: "16px", border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
              <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                <Stack spacing={2}>
                  <Typography variant="h6" fontWeight={900}>Manual Submit</Typography>
                  <Tabs value={mode} onChange={(_e, value) => setMode(value)}>
                    <Tab value="sitemap" label="Submit Sitemap URLs" />
                    <Tab value="urls" label="Submit Manual URL List" />
                  </Tabs>

                  {mode === "sitemap" ? (
                    <TextField
                      label="Sitemap URL"
                      value={sitemapUrl}
                      onChange={(event) => setSitemapUrl(event.target.value)}
                      placeholder="https://example.com/sitemap.xml"
                      fullWidth
                    />
                  ) : (
                    <TextField
                      label="URLs (one per line or comma separated)"
                      value={manualUrls}
                      onChange={(event) => setManualUrls(event.target.value)}
                      placeholder="https://example.com/page-1"
                      multiline
                      minRows={6}
                      fullWidth
                    />
                  )}

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ xs: "stretch", sm: "center" }}>
                    <Button
                      variant="contained"
                      onClick={() => void handleSubmit()}
                      disabled={submitting}
                      startIcon={<SendRoundedIcon />}
                      sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 800 }}
                    >
                      {submitting ? "Submitting..." : "Start Submission"}
                    </Button>
                    <Typography variant="body2" color="text.secondary">
                      IndexNow runs in safe batches (1000 URLs) and Bing uses batch endpoint limits automatically.
                    </Typography>
                  </Stack>

                  {submitError ? <Alert severity="error">{submitError}</Alert> : null}
                  {submitResult ? (
                    <Alert severity="success">
                      Submitted {submitResult.totalUrls} URL(s). IndexNow: {submitResult.stats.indexNow.successBatches}/
                      {submitResult.stats.indexNow.batches} successful batches. Bing: {submitResult.stats.bing.successBatches}/
                      {submitResult.stats.bing.batches} successful batches.
                    </Alert>
                  ) : null}

                  {submitResult ? (
                    <Box sx={{ p: 1.5, border: "1px dashed", borderColor: "divider", borderRadius: "10px", maxHeight: 220, overflow: "auto" }}>
                      <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1 }}>Submission Logs</Typography>
                      <Stack spacing={0.5}>
                        {submitResult.logs.map((entry) => (
                          <Typography key={entry} variant="caption" sx={{ fontFamily: "monospace", color: "text.secondary" }}>
                            {entry}
                          </Typography>
                        ))}
                      </Stack>
                    </Box>
                  ) : null}
                </Stack>
              </CardContent>
            </Card>

            <Stack direction={{ xs: "column", lg: "row" }} spacing={2}>
              <Card sx={{ flex: 1, borderRadius: "16px", border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
                <CardContent>
                  <Stack spacing={1.25}>
                    <Typography variant="h6" fontWeight={900}>Sitemaps</Typography>
                    {payload.sitemaps.candidates.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">No sitemap candidates available.</Typography>
                    ) : (
                      payload.sitemaps.candidates.map((entry) => (
                        <Typography key={entry} variant="body2" sx={{ wordBreak: "break-all" }}>{entry}</Typography>
                      ))
                    )}
                    {payload.sitemapPreview.error ? (
                      <Alert severity="warning" sx={{ mt: 1 }}>{payload.sitemapPreview.error}</Alert>
                    ) : null}
                  </Stack>
                </CardContent>
              </Card>

              <Card sx={{ flex: 1, borderRadius: "16px", border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
                <CardContent>
                  <Stack spacing={1.25}>
                    <Typography variant="h6" fontWeight={900}>Submission Stats</Typography>
                    {payload.stats.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">No submission history yet.</Typography>
                    ) : (
                      payload.stats.map((row) => (
                        <Stack key={row.engine} direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" sx={{ textTransform: "capitalize" }}>{row.engine}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {row.success} success / {row.failed} failed (total {row.total})
                          </Typography>
                        </Stack>
                      ))
                    )}
                    <Divider sx={{ my: 0.75 }} />
                    <Typography variant="caption" color="text.secondary">
                      IndexNow: {statsMap.get("indexnow")?.total ?? 0} records | Bing: {statsMap.get("bing")?.total ?? 0} records
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>

            <Card sx={{ borderRadius: "16px", border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
              <CardContent>
                <Stack spacing={1.5}>
                  <Typography variant="h6" fontWeight={900}>URLs & Inventory</Typography>
                  {payload.inventory.urls.length === 0 && payload.sitemapPreview.urls.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">No URLs available yet. Run sync or submit from sitemap.</Typography>
                  ) : (
                    <Stack spacing={0.8}>
                      {payload.inventory.urls.slice(0, 120).map((row) => (
                        <Stack key={row.id} direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={0.5}>
                          <Typography variant="body2" sx={{ wordBreak: "break-all" }}>{row.url}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Last detected: {row.lastDetectedAt ? new Date(row.lastDetectedAt).toLocaleString() : "N/A"}
                          </Typography>
                        </Stack>
                      ))}

                      {payload.inventory.urls.length < 120
                        ? payload.sitemapPreview.urls.slice(0, 120 - payload.inventory.urls.length).map((url) => (
                            <Typography key={url} variant="body2" sx={{ wordBreak: "break-all", color: "text.secondary" }}>
                              {url}
                            </Typography>
                          ))
                        : null}
                    </Stack>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </>
        ) : null}
      </Stack>
    </Box>
  );
}
