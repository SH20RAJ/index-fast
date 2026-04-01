"use client";
import React, { useEffect, useState } from "react";
import { Box, Stack, Typography, CircularProgress } from "@mui/material";
import PageHeader from "@/components/dashboard/PageHeader";
import AuditPanel from "@/components/dashboard/AuditPanel";
import type { AuditIssue } from "@/components/dashboard/AuditPanel";

interface SiteAuditViewProps {
  id: string;
}

interface SiteAuditRecord {
  id: string;
  url: string;
  siteHealth?: {
    score: number;
    issues: AuditIssue[];
  };
}

export default function SiteAuditView({ id }: SiteAuditViewProps) {
  const [site, setSite] = useState<SiteAuditRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/websites")
      .then((res) => res.json())
      .then((data: unknown) => {
        const websites = Array.isArray(data) ? (data as SiteAuditRecord[]) : [];
        const found = websites.find((s) => s.id === id) ?? null;
        setSite(found);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <CircularProgress />
      </Box>
    );
  }

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
          description={`Analyzing SEO health for ${new URL(site.url).hostname}`}
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
