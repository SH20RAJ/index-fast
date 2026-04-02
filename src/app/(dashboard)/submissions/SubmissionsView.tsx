"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  MenuItem,
  Stack,
  TextField,
  Typography,
  alpha,
  Grid,
} from "@/components/ui/mui";
import { CheckCircleIcon } from "@/components/icons/mui-icons";
import { ErrorOutlineIcon } from "@/components/icons/mui-icons";
import { HistoryIcon } from "@/components/icons/mui-icons";
import PageHeader from "@/components/dashboard/PageHeader";

type SubmissionRow = {
  id: string;
  url: string;
  engine: "bing" | "indexnow" | "google" | "pingomatic" | "pingler";
  status: "success" | "failed" | "pending";
  errorMessage: string | null;
  createdAt: string | null;
  websiteId: string;
  websiteUrl: string;
};

const statusColor = {
  success: "#059669",
  failed: "#DC2626",
  pending: "#D97706",
};

interface SubmissionsViewProps {
  initialRows: SubmissionRow[];
}

export default function SubmissionsView({ initialRows }: SubmissionsViewProps) {
  const [rows] = useState<SubmissionRow[]>(initialRows);
  const [statusFilter, setStatusFilter] = useState<"all" | SubmissionRow["status"]>("all");
  const [engineFilter, setEngineFilter] = useState<"all" | SubmissionRow["engine"]>("all");

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      const statusOk = statusFilter === "all" || row.status === statusFilter;
      const engineOk = engineFilter === "all" || row.engine === engineFilter;
      return statusOk && engineOk;
    });
  }, [rows, statusFilter, engineFilter]);

  const totals = useMemo(() => {
    return {
      all: rows.length,
      success: rows.filter((r) => r.status === "success").length,
      failed: rows.filter((r) => r.status === "failed").length,
      pending: rows.filter((r) => r.status === "pending").length,
    };
  }, [rows]);

  return (
    <Box sx={{ pt: 1, pb: 8 }}>
      <Stack spacing={3}>
        <PageHeader
          title="Submissions"
          description="Monitor every IndexNow, Bing, and ping submission in one timeline."
        />

        <Grid container spacing={2}>
          {[
            { label: "Total", value: totals.all },
            { label: "Success", value: totals.success },
            { label: "Failed", value: totals.failed },
            { label: "Pending", value: totals.pending },
          ].map((item) => (
            <Grid key={item.label} size={{ xs: 6, md: 3 }}>
              <Card sx={{ borderRadius: "16px", border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
                <CardContent sx={{ p: 2.25 }}>
                  <Typography variant="h5" fontWeight={900}>
                    {item.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Card sx={{ borderRadius: "16px", border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
          <CardContent sx={{ p: 2.25 }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <TextField
                select
                fullWidth
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "all" | SubmissionRow["status"])}
              >
                <MenuItem value="all">All statuses</MenuItem>
                <MenuItem value="success">Success</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </TextField>
              <TextField
                select
                fullWidth
                label="Engine"
                value={engineFilter}
                onChange={(e) => setEngineFilter(e.target.value as "all" | SubmissionRow["engine"])}
              >
                <MenuItem value="all">All engines</MenuItem>
                <MenuItem value="indexnow">IndexNow</MenuItem>
                <MenuItem value="bing">Bing</MenuItem>
                <MenuItem value="google">Google</MenuItem>
                <MenuItem value="pingomatic">Ping-o-Matic</MenuItem>
                <MenuItem value="pingler">Pingler</MenuItem>
              </TextField>
            </Stack>
          </CardContent>
        </Card>

        {rows.length === 0 || filtered.length === 0 ? (
          <Card sx={{ borderRadius: "18px", border: "1px dashed", borderColor: "divider", boxShadow: "none" }}>
            <CardContent sx={{ p: 4, textAlign: "center" }}>
              <HistoryIcon sx={{ fontSize: 42, opacity: 0.25, mb: 1 }} />
              <Typography variant="h6" fontWeight={800} gutterBottom>
                No submissions found
              </Typography>
              <Typography color="text.secondary">Run a website sync to generate your first submission log.</Typography>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={1.5}>
            {filtered.map((row) => (
              <Card
                key={row.id}
                sx={{
                  borderRadius: "14px",
                  border: "1px solid",
                  borderColor: alpha(statusColor[row.status], 0.22),
                  boxShadow: "none",
                }}
              >
                <CardContent sx={{ p: 2.25 }}>
                  <Stack spacing={1.25}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                      <Typography variant="subtitle1" fontWeight={800} sx={{ wordBreak: "break-all" }}>
                        {row.websiteUrl}
                      </Typography>
                      <Chip
                        icon={
                          row.status === "success" ? (
                            <CheckCircleIcon sx={{ color: `${statusColor[row.status]} !important` }} />
                          ) : (
                            <ErrorOutlineIcon sx={{ color: `${statusColor[row.status]} !important` }} />
                          )
                        }
                        label={row.status.toUpperCase()}
                        size="small"
                        sx={{
                          bgcolor: alpha(statusColor[row.status], 0.08),
                          color: statusColor[row.status],
                          fontWeight: 800,
                        }}
                      />
                    </Stack>

                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                      <Chip size="small" label={row.engine.toUpperCase()} sx={{ borderRadius: "8px", fontWeight: 700 }} />
                      <Chip
                        size="small"
                        label={row.createdAt ? new Date(row.createdAt).toLocaleString() : "Unknown time"}
                        sx={{ borderRadius: "8px", fontWeight: 700 }}
                      />
                    </Stack>

                    <Typography variant="body2" color="text.secondary" sx={{ wordBreak: "break-all" }}>
                      URL: {row.url}
                    </Typography>

                    {row.errorMessage ? (
                      <Alert severity="warning" sx={{ borderRadius: "10px" }}>
                        {row.errorMessage}
                      </Alert>
                    ) : null}
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
