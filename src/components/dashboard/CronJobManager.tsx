"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export interface CronJob {
  id: string;
  websiteId: string;
  enabled: boolean;
  frequency: "hourly" | "daily" | "weekly" | "monthly";
  engine: "indexnow" | "bing" | "google";
  sourceMode: "sitemap" | "inventory";
  lastRunAt: string | null;
  nextRunAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CronJobManagerProps {
  websiteId: string;
  websiteUrl: string;
  cronJobs: CronJob[];
  onRefresh: () => void;
}

export default function CronJobManager({
  websiteId,
  websiteUrl,
  cronJobs,
  onRefresh,
}: CronJobManagerProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [frequency, setFrequency] = useState<"hourly" | "daily" | "weekly" | "monthly">("daily");
  const [engine, setEngine] = useState<"indexnow" | "bing" | "google">("indexnow");
  const [sourceMode, setSourceMode] = useState<"sitemap" | "inventory">("sitemap");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleCreateCronJob() {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`/api/websites/${websiteId}/cron-jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frequency, engine, sourceMode }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to create cron job");
      }

      setOpenDialog(false);
      onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create cron job");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleCronJob(cronJobId: string, enabled: boolean) {
    setError(null);

    try {
      const response = await fetch(
        `/api/websites/${websiteId}/cron-jobs/${cronJobId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ enabled: !enabled }),
        }
      );

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to update cron job");
      }

      onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update cron job");
    }
  }

  async function handleDeleteCronJob(cronJobId: string) {
    setDeleting(cronJobId);
    setError(null);

    try {
      const response = await fetch(
        `/api/websites/${websiteId}/cron-jobs/${cronJobId}`,
        { method: "DELETE" }
      );

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete cron job");
      }

      onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete cron job");
    } finally {
      setDeleting(null);
    }
  }

  const formatNextRun = (nextRunAt: string | null) => {
    if (!nextRunAt) return "Not scheduled";
    const date = new Date(nextRunAt);
    const now = new Date();
    const diff = date.getTime() - now.getTime();

    if (diff < 0) return "Overdue";
    if (diff < 60000) return "In < 1 minute";
    if (diff < 3600000) return `In ${Math.floor(diff / 60000)} minutes`;
    if (diff < 86400000) return `In ${Math.floor(diff / 3600000)} hours`;
    return date.toLocaleDateString();
  };

  const formatLastRun = (lastRunAt: string | null) => {
    if (!lastRunAt) return "Never";
    const date = new Date(lastRunAt);
    return date.toLocaleString();
  };

  return (
    <Card sx={{ borderRadius: "16px", border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack>
              <Typography variant="h6" fontWeight={900}>
                Auto-Submit Schedule
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Set up recurring submissions to IndexNow, Bing, or Google
              </Typography>
            </Stack>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 800 }}
            >
              Add Schedule
            </Button>
          </Stack>

          {error && <Alert severity="error">{error}</Alert>}

          {cronJobs.length === 0 ? (
            <Box
              sx={{
                p: 2,
                textAlign: "center",
                bgcolor: "background.default",
                borderRadius: "10px",
              }}
            >
              <AccessTimeIcon sx={{ fontSize: 40, color: "text.secondary", mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                No schedules yet. Create one to automate submissions.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={1}>
              {cronJobs.map((cronJob) => (
                <Card
                  key={cronJob.id}
                  variant="outlined"
                  sx={{ borderRadius: "10px", "&:hover": { bgcolor: "action.hover" } }}
                >
                  <CardContent sx={{ py: 1.5, px: 2, "&:last-child": { pb: 1.5 } }}>
                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", md: "center" }}
                      spacing={1}
                    >
                      <Stack spacing={0.5} sx={{ flex: 1 }}>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          <Chip
                            label={`${cronJob.frequency.charAt(0).toUpperCase() + cronJob.frequency.slice(1)}`}
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: 700 }}
                          />
                          <Chip
                            label={cronJob.engine.toUpperCase()}
                            size="small"
                            color={
                              cronJob.engine === "indexnow"
                                ? "primary"
                                : cronJob.engine === "bing"
                                  ? "info"
                                  : "default"
                            }
                            sx={{ fontWeight: 700 }}
                          />
                          <Chip
                            label={cronJob.sourceMode === "sitemap" ? "Sitemap" : "Inventory"}
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: 700 }}
                          />
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                          Last run: {formatLastRun(cronJob.lastRunAt)} · Next run: {formatNextRun(cronJob.nextRunAt)}
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={0.75} alignItems="center">
                        <FormControlLabel
                          control={
                            <Switch
                              checked={cronJob.enabled}
                              onChange={() => handleToggleCronJob(cronJob.id, cronJob.enabled)}
                            />
                          }
                          label={cronJob.enabled ? "Active" : "Inactive"}
                          sx={{ whiteSpace: "nowrap" }}
                        />
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteOutlineIcon />}
                          onClick={() => handleDeleteCronJob(cronJob.id)}
                          disabled={deleting === cronJob.id}
                          sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 700 }}
                        >
                          {deleting === cronJob.id ? <CircularProgress size={16} /> : "Delete"}
                        </Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </Stack>
      </CardContent>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 900 }}>Create Auto-Submit Schedule</DialogTitle>
        <DialogContent sx={{ pt: 2, pb: 1 }}>
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              Website: {websiteUrl}
            </Typography>

            <TextField
              select
              label="Frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as any)}
              fullWidth
            >
              <MenuItem value="hourly">Hourly</MenuItem>
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </TextField>

            <TextField
              select
              label="Search Engine"
              value={engine}
              onChange={(e) => setEngine(e.target.value as any)}
              fullWidth
            >
              <MenuItem value="indexnow">IndexNow</MenuItem>
              <MenuItem value="bing">Bing Webmaster</MenuItem>
              <MenuItem value="google">Google Search Console</MenuItem>
            </TextField>

            <TextField
              select
              label="Source"
              value={sourceMode}
              onChange={(e) => setSourceMode(e.target.value as any)}
              fullWidth
            >
              <MenuItem value="sitemap">Sitemap URLs</MenuItem>
              <MenuItem value="inventory">Detected Inventory</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => handleCreateCronJob()}
            disabled={loading}
            sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 800 }}
          >
            {loading ? <CircularProgress size={18} /> : "Create Schedule"}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
