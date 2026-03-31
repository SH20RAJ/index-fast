"use client";
import React, { useEffect, useState } from "react";
import { Box, Stack, Typography, CircularProgress, alpha } from "@mui/material";
import PageHeader from "@/components/dashboard/PageHeader";
import AuditPanel from "@/components/dashboard/AuditPanel";
import { useParams } from "next/navigation";

export default function SiteAuditPage() {
  const params = useParams();
  const id = params.id as string;
  const [site, setSite] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/websites")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((s: any) => s.id === id);
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
