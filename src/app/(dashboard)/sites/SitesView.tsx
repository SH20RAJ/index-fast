"use client";
import { useState, useEffect } from "react";
import { Box, Button, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PageHeader from "@/components/dashboard/PageHeader";
import SitesList from "@/components/dashboard/SitesList";
import SitesEmptyState from "@/components/dashboard/SitesEmptyState";
import { Website } from "@/components/dashboard/types";

export default function SitesView() {
  const [sites, setSites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/websites")
      .then((res) => res.json())
      .then((data) => {
        setSites(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSync = async (id: string) => {
    try {
      const res = await fetch(`/api/websites/${id}/sync`, { method: "POST" });
      const data = await res.json();
      console.log("Sync result:", data);
      // Refresh list or show success toast
    } catch (error) {
      console.error("Sync failed:", error);
    }
  };

  return (
    <Box sx={{ pt: 2, pb: 8 }}>
      <Stack spacing={4}>
        <PageHeader
          title="Websites"
          description="Manage your tracked sites and trigger manual indexing."
          action={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                py: 1.5,
                px: 3,
                borderRadius: "14px",
                boxShadow: "0 10px 40px rgba(124, 58, 237, 0.2)",
              }}
            >
              Add Website
            </Button>
          }
        />

        {sites.length > 0 ? <SitesList sites={sites} onSync={handleSync} /> : <SitesEmptyState />}
      </Stack>
    </Box>
  );
}
