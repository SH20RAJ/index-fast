"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  Button,
  IconButton,
  Tooltip,
  alpha,
  Divider,
  Chip,
} from "@/components/ui/mui";
import { ContentCopyIcon } from "@/components/icons/mui-icons";
import { WarningAmberIcon } from "@/components/icons/mui-icons";
import { ErrorOutlineIcon } from "@/components/icons/mui-icons";
import { InfoOutlinedIcon } from "@/components/icons/mui-icons";
import { CheckCircleIcon } from "@/components/icons/mui-icons";
import { RefreshIcon } from "@/components/icons/mui-icons";

export interface AuditIssue {
  type: "error" | "warning" | "info";
  title: string;
  description: string;
  recommendation: string;
  cursorPrompt: string;
}

interface AuditPanelProps {
  websiteId: string;
  initialResult?: {
    score: number;
    issues: AuditIssue[];
  };
}

function normalizeAuditResult(input: unknown) {
  if (!input || typeof input !== "object") {
    return null;
  }

  const candidate = input as { score?: unknown; issues?: unknown };
  return {
    score: typeof candidate.score === "number" ? candidate.score : 0,
    issues: Array.isArray(candidate.issues) ? (candidate.issues as AuditIssue[]) : [],
  };
}

export default function AuditPanel({ websiteId, initialResult }: AuditPanelProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(() => normalizeAuditResult(initialResult));

  const runAudit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/websites/${websiteId}/audit`, { method: "POST" });
      const data = await res.json();
      setResult(normalizeAuditResult(data));
    } catch (error) {
      console.error("Audit failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
  };

  if (!result && !loading) {
    return (
      <Card sx={{ borderRadius: "24px", p: 4, textAlign: "center", border: "1px dashed rgba(0,0,0,0.1)" }}>
        <Stack spacing={2} alignItems="center">
          <Typography variant="h6" fontWeight={700}>Run AI SEO Audit</Typography>
          <Typography variant="body2" color="text.secondary">
            Get instant SEO insights and ready-to-use Cursor prompts to fix your site.
          </Typography>
          <Button variant="contained" onClick={runAudit} startIcon={<RefreshIcon />}>
            Start Audit
          </Button>
        </Stack>
      </Card>
    );
  }

  const score = result?.score ?? 0;
  const issues = result?.issues ?? [];

  return (
    <Box>
      <Stack spacing={3}>
        {/* Score Header */}
        <Card sx={{ borderRadius: "24px", bgcolor: "white", p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  border: "4px solid",
                  borderColor: score > 80 ? "success.main" : score > 50 ? "warning.main" : "error.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h5" fontWeight={900}>
                  {score}
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={800}>SEO Health Score</Typography>
                <Typography variant="caption" color="text.secondary">
                  Based on critical on-page SEO signals
                </Typography>
              </Box>
            </Stack>
            <Button
              variant="outlined"
              size="small"
              onClick={runAudit}
              disabled={loading}
              startIcon={<RefreshIcon className={loading ? "animate-spin" : ""} />}
            >
              Re-audit
            </Button>
          </Stack>
        </Card>

        {/* Issues List */}
        <Stack spacing={2}>
          {issues.length === 0 ? (
            <Card sx={{ borderRadius: "24px", p: 4, textAlign: "center" }}>
              <CheckCircleIcon color="success" sx={{ fontSize: 48, mb: 1 }} />
              <Typography fontWeight={700}>Everything looks great!</Typography>
              <Typography variant="body2" color="text.secondary">No critical SEO issues found.</Typography>
            </Card>
          ) : (
            issues.map((issue, idx) => (
              <Card key={idx} sx={{ borderRadius: "24px", border: "1px solid rgba(0,0,0,0.05)" }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: "10px",
                        bgcolor: alpha(issue.type === "error" ? "#EF4444" : issue.type === "warning" ? "#F59E0B" : "#3B82F6", 0.1),
                        color: issue.type === "error" ? "error.main" : issue.type === "warning" ? "warning.main" : "info.main",
                      }}
                    >
                      {issue.type === "error" ? <ErrorOutlineIcon /> : issue.type === "warning" ? <WarningAmberIcon /> : <InfoOutlinedIcon />}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="subtitle1" fontWeight={800}>{issue.title}</Typography>
                        <Chip
                          label={issue.type.toUpperCase()}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: "10px",
                            bgcolor: alpha(issue.type === "error" ? "#EF4444" : issue.type === "warning" ? "#F59E0B" : "#3B82F6", 0.1),
                            color: issue.type === "error" ? "error.main" : issue.type === "warning" ? "warning.main" : "info.main",
                          }}
                        />
                      </Stack>
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        {issue.description}
                      </Typography>
                      
                      <Box sx={{ p: 2, bgcolor: "#F9FAFB", borderRadius: "16px", border: "1px solid rgba(0,0,0,0.03)" }}>
                        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase", display: "block", mb: 1 }}>
                          Cursor Prompt to Fix
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="flex-start">
                          <Typography variant="body2" sx={{ fontStyle: "italic", flexGrow: 1 }}>
                            &quot;{issue.cursorPrompt}&quot;
                          </Typography>
                          <Tooltip title="Copy Prompt">
                            <IconButton
                              size="small"
                              aria-label="Copy cursor prompt"
                              onClick={() => copyPrompt(issue.cursorPrompt)}
                              sx={{ mt: -0.5 }}
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Box>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            ))
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
