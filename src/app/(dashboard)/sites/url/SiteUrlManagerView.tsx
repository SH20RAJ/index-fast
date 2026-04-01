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
  Pagination,
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import DownloadIcon from "@mui/icons-material/Download";
import Link from "next/link";
import PageHeader from "@/components/dashboard/PageHeader";
import {
  buildBingIndexNowPortalUrl,
  buildGoogleSearchConsolePropertyUrl,
} from "@/lib/utils";

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

  // Pagination state
  const [urlsPage, setUrlsPage] = useState(1);
  const [logsPage, setLogsPage] = useState(1);
  const urlsPerPage = 25;
  const logsPerPage = 15;

  const paginatedUrls = useMemo(() => {
    if (!payload) return [];
    const allUrls: Array<{ id: string; url: string; isIndexed: boolean | null; lastDetectedAt: string | null } | string> = [
      ...(payload.inventory.urls || []),
    ];
    // Add sitemap URLs only if we need them
    if (allUrls.length < urlsPerPage) {
      const remaining = urlsPerPage - allUrls.length;
      allUrls.push(
        ...(payload.sitemapPreview.urls || []).slice(0, remaining).map((url) => url)
      );
    }
    const start = (urlsPage - 1) * urlsPerPage;
    return allUrls.slice(start, start + urlsPerPage);
  }, [payload, urlsPage]);

  const urlsTotalPages = useMemo(() => {
    if (!payload) return 0;
    const total = (payload.inventory.urls?.length ?? 0) + (payload.sitemapPreview.urls?.length ?? 0);
    return Math.ceil(total / urlsPerPage);
  }, [payload]);

  const paginatedLogs = useMemo(() => {
    if (!submitResult) return [];
    const start = (logsPage - 1) * logsPerPage;
    return submitResult.logs.slice(start, start + logsPerPage);
  }, [submitResult, logsPage]);

  const logsTotalPages = useMemo(() => {
    if (!submitResult) return 0;
    return Math.ceil(submitResult.logs.length / logsPerPage);
  }, [submitResult]);

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

  function exportUrls(format: "csv" | "json") {
    if (!payload) return;

    const allUrls: Array<{ id: string; url: string; isIndexed: boolean | null; lastDetectedAt: string | null } | string> = [
      ...(payload.inventory.urls || []),
    ];
    allUrls.push(...(payload.sitemapPreview.urls || []));

    let content: string;
    let filename: string;

    if (format === "csv") {
      const headers = ["URL", "Status", "Last Detected"];
      const rows = allUrls.map((urlItem) => {
        const url = typeof urlItem === "object" ? urlItem.url : urlItem;
        const status = typeof urlItem === "object" ? (urlItem.isIndexed ? "Indexed" : "Not Indexed") : "Unknown";
        const lastDetected =
          typeof urlItem === "object" && urlItem.lastDetectedAt
            ? `"${new Date(urlItem.lastDetectedAt).toLocaleString()}"`
            : "N/A";
        return [
          `"${url.replace(/"/g, '""')}"`,
          status,
          lastDetected,
        ];
      });
      content = [headers, ...rows].map((row) => row.join(",")).join("\n");
      filename = `urls-${new Date().toISOString().split("T")[0]}.csv`;
    } else {
      const data = allUrls.map((urlItem) => {
        if (typeof urlItem === "object") {
          return {
            url: urlItem.url,
            isIndexed: urlItem.isIndexed,
            lastDetectedAt: urlItem.lastDetectedAt,
          };
        }
        return { url: urlItem, isIndexed: null, lastDetectedAt: null };
      });
      content = JSON.stringify(data, null, 2);
      filename = `urls-${new Date().toISOString().split("T")[0]}.json`;
    }

    const blob = new Blob([content], { type: format === "csv" ? "text/csv" : "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function exportLogs(format: "csv" | "json") {
    if (!submitResult) return;

    let content: string;
    let filename: string;

    if (format === "csv") {
      const headers = ["Log Entry"];
      const rows = submitResult.logs.map((log) => [
        `"${log.replace(/"/g, '""')}"`,
      ]);
      content = [headers, ...rows].map((row) => row.join(",")).join("\n");
      filename = `submission-logs-${new Date().toISOString().split("T")[0]}.csv`;
    } else {
      const data = { timestamp: new Date().toISOString(), logs: submitResult.logs };
      content = JSON.stringify(data, null, 2);
      filename = `submission-logs-${new Date().toISOString().split("T")[0]}.json`;
    }

    const blob = new Blob([content], { type: format === "csv" ? "text/csv" : "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

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
                <Stack spacing={1.5}>
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

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                    <Button
                      component="a"
                      href={buildBingIndexNowPortalUrl(payload.website.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outlined"
                      sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 800 }}
                    >
                      Open Bing IndexNow
                    </Button>
                    <Button
                      component="a"
                      href={buildGoogleSearchConsolePropertyUrl(payload.website.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outlined"
                      sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 800 }}
                    >
                      Open in GSC
                    </Button>
                  </Stack>
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
                    <Box sx={{ p: 1.5, border: "1px dashed", borderColor: "divider", borderRadius: "10px", maxHeight: 320, overflow: "auto" }}>
                      <Stack spacing={1.5}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle2" fontWeight={800}>Submission Logs ({submitResult.logs.length})</Typography>
                          <Stack direction="row" spacing={0.5}>
                            <Button size="small" variant="outlined" startIcon={<DownloadIcon />} onClick={() => exportLogs("csv")}>CSV</Button>
                            <Button size="small" variant="outlined" startIcon={<DownloadIcon />} onClick={() => exportLogs("json")}>JSON</Button>
                          </Stack>
                        </Stack>
                        <Stack spacing={0.5}>
                          {paginatedLogs.map((entry) => (
                            <Typography key={entry} variant="caption" sx={{ fontFamily: "monospace", color: "text.secondary" }}>
                              {entry}
                            </Typography>
                          ))}
                        </Stack>
                        {logsTotalPages > 1 && (
                          <Stack alignItems="center" sx={{ pt: 1 }}>
                            <Pagination size="small" count={logsTotalPages} page={logsPage} onChange={(_e, page) => setLogsPage(page)} />
                          </Stack>
                        )}
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
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight={900}>
                      URLs & Inventory ({(payload?.inventory.urls?.length ?? 0) + (payload?.sitemapPreview.urls?.length ?? 0)})
                    </Typography>
                    <Stack direction="row" spacing={0.5}>
                      <Button size="small" variant="outlined" startIcon={<DownloadIcon />} onClick={() => exportUrls("csv")}>CSV</Button>
                      <Button size="small" variant="outlined" startIcon={<DownloadIcon />} onClick={() => exportUrls("json")}>JSON</Button>
                    </Stack>
                  </Stack>
                  {payload?.inventory.urls?.length === 0 && payload.sitemapPreview.urls?.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">No URLs available yet. Run sync or submit from sitemap.</Typography>
                  ) : (
                    <Stack spacing={0.8}>
                      {paginatedUrls.map((urlItem, idx) => {
                        const url = typeof urlItem === "object" ? urlItem.url : urlItem;
                        const urlId = typeof urlItem === "object" ? urlItem.id : url;
                        const lastDetected =
                          typeof urlItem === "object" && urlItem.lastDetectedAt
                            ? `Last detected: ${new Date(urlItem.lastDetectedAt).toLocaleString()}`
                            : "N/A";
                        return (
                          <Stack key={`${urlId}-${idx}`} direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={0.5}>
                            <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                              {url}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {lastDetected}
                            </Typography>
                          </Stack>
                        );
                      })}
                      {urlsTotalPages > 1 && (
                        <Stack alignItems="center" sx={{ pt: 2 }}>
                          <Pagination size="small" count={urlsTotalPages} page={urlsPage} onChange={(_e, page) => setUrlsPage(page)} />
                        </Stack>
                      )}
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
