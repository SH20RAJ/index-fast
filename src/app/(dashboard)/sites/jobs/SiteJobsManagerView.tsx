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
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import PageHeader from "@/components/dashboard/PageHeader";
import CronJobManager, { type CronJob } from "@/components/dashboard/CronJobManager";

interface SiteOption {
  id: string;
  url: string;
  sitemapUrl: string | null;
}

interface SiteJobsManagerViewProps {
  sites: SiteOption[];
  initialSiteId: string | null;
}

interface SiteJobsResponse {
  jobs: CronJob[];
}

export default function SiteJobsManagerView({ sites, initialSiteId }: SiteJobsManagerViewProps) {
  const [siteId, setSiteId] = useState<string>(initialSiteId ?? "");
  const [jobs, setJobs] = useState<CronJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedSite = useMemo(() => sites.find((site) => site.id === siteId) ?? null, [sites, siteId]);

  async function loadJobs(targetSiteId: string) {
    if (!targetSiteId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/websites/${targetSiteId}/cron-jobs`, { cache: "no-store" });
      const payload = (await response.json()) as SiteJobsResponse | { error?: string };

      if (!response.ok) {
        throw new Error((payload as { error?: string }).error || "Failed to load jobs.");
      }

      setJobs((payload as SiteJobsResponse).jobs ?? []);
    } catch (err) {
      setJobs([]);
      setError(err instanceof Error ? err.message : "Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!siteId) {
      return;
    }

    void loadJobs(siteId);
  }, [siteId]);

  if (sites.length === 0) {
    return (
      <Box sx={{ pt: 2, pb: 8 }}>
        <Stack spacing={3}>
          <PageHeader
            title="Auto Submit Jobs"
            description="Create recurring indexing schedules for your websites."
          />
          <Card sx={{ borderRadius: "16px", border: "1px dashed", borderColor: "divider", boxShadow: "none" }}>
            <CardContent sx={{ py: 7, textAlign: "center" }}>
              <Typography variant="h6" fontWeight={900}>No websites found</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Add a website first, then come back here to automate submissions.
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
          title="Auto Submit Jobs"
          description="Schedule recurring submissions to IndexNow/Bing and monitor automation state."
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

        {selectedSite ? (
          <Card sx={{ borderRadius: "16px", border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
            <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
              <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={1}>
                <Box>
                  <Typography variant="subtitle1" fontWeight={900} sx={{ wordBreak: "break-all" }}>
                    {selectedSite.url}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ wordBreak: "break-all" }}>
                    Sitemap: {selectedSite.sitemapUrl || "Not configured"}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" alignItems="flex-start">
                  <Chip label={`Jobs: ${jobs.length}`} size="small" sx={{ borderRadius: "8px", fontWeight: 700 }} />
                  <Chip
                    label={`Active: ${jobs.filter((job) => job.enabled).length}`}
                    size="small"
                    color={jobs.some((job) => job.enabled) ? "success" : "default"}
                    sx={{ borderRadius: "8px", fontWeight: 700 }}
                  />
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ) : null}

        {loading ? (
          <Stack direction="row" alignItems="center" spacing={1}>
            <CircularProgress size={18} />
            <Typography variant="body2" color="text.secondary">Loading jobs...</Typography>
          </Stack>
        ) : null}

        {selectedSite && !loading ? (
          <CronJobManager
            websiteId={selectedSite.id}
            websiteUrl={selectedSite.url}
            cronJobs={jobs}
            onRefresh={() => {
              void loadJobs(selectedSite.id);
            }}
          />
        ) : null}
      </Stack>
    </Box>
  );
}
