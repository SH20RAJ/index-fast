"use client";
import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import PageHeader from "@/components/dashboard/PageHeader";
import AuditPanel from "@/components/dashboard/AuditPanel";
import type { AuditIssue } from "@/components/dashboard/AuditPanel";

interface SiteAuditViewProps {
  id: string;
  initialSite: SiteAuditRecord | null;
}

interface SiteAuditRecord {
  id: string;
  url: string;
  siteHealth?: {
    score: number;
    issues: AuditIssue[];
  };
}

function getHostname(rawUrl: string) {
  try {
    return new URL(rawUrl).hostname;
  } catch {
    return rawUrl;
  }
}

export default function SiteAuditView({ id, initialSite }: SiteAuditViewProps) {
  const site = initialSite;

  if (!site) {
    return (
      <Box sx={{ py: 12, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">Website not found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ pt: 2, pb: 8 }}>
      <Stack spacing={4}>
        <PageHeader
          title="AI SEO Audit"
          description={`Analyzing SEO health for ${getHostname(site.url)}`}
        />

        <Box sx={{ maxWidth: "800px", mx: "auto", width: "100%" }}>
          <AuditPanel 
            websiteId={id} 
            initialResult={site.siteHealth}
          />
        </Box>
      </Stack>
    </Box>
  );
}
