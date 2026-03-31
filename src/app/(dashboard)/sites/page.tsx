"use client";
import { useState, useEffect } from "react";
import { Box, Typography, Stack, Grid, Button, alpha, Card, CardContent, IconButton, Tooltip, Badge } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PublicIcon from "@mui/icons-material/Public";
import BoltIcon from "@mui/icons-material/Bolt";
import SearchIcon from "@mui/icons-material/Search";

interface Website {
  id: string;
  url: string;
  sitemapUrl: string;
  isPro: boolean;
  lastSyncAt: string | null;
}

export default function SitesPage() {
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
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
          <Box>
            <Typography variant="h3" fontWeight={900} color="#111827" sx={{ mb: 1 }}>
              Websites
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your tracked sites and trigger manual indexing.
            </Typography>
          </Box>
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
        </Stack>

        {/* Site List */}
        <Stack spacing={3}>
          {sites.length > 0 ? (
            sites.map((site) => (
              <Box key={site.id}>
                <Card
                  sx={{
                    borderRadius: "24px",
                    border: "1px solid",
                    borderColor: "rgba(0,0,0,0.05)",
                    transition: "all 0.2s",
                    "&:hover": { borderColor: "primary.main", boxShadow: "0 10px 40px rgba(124, 58, 237, 0.05)" },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Stack direction="row" spacing={3} alignItems="center">
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: "16px",
                            bgcolor: alpha("#7C3AED", 0.05),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "primary.main",
                          }}
                        >
                          <PublicIcon />
                        </Box>
                        <Box>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="h6" fontWeight={800} color="#111827">
                              {new URL(site.url).hostname}
                            </Typography>
                            {site.isPro && (
                              <Tooltip title="Pro Plan Active">
                                <Badge
                                  badgeContent={<BoltIcon sx={{ fontSize: 12, color: "white" }} />}
                                  sx={{ "& .MuiBadge-badge": { bgcolor: "secondary.main", border: "2px solid white" } }}
                                />
                              </Tooltip>
                            )}
                          </Stack>
                          <Typography variant="body2" color="text.secondary">
                            {site.url}
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" spacing={4} alignItems="center">
                        <Box sx={{ textAlign: "right", display: { xs: "none", md: "block" } }}>
                          <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: "uppercase" }}>
                            Last Sync
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {site.lastSyncAt ? new Date(site.lastSyncAt).toLocaleString() : "Never"}
                          </Typography>
                        </Box>
                        
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Sync Sitemap">
                            <IconButton 
                              onClick={() => handleSync(site.id)}
                              sx={{ bgcolor: alpha("#7C3AED", 0.05), color: "primary.main", "&:hover": { bgcolor: "primary.main", color: "white" } }}
                            >
                              <RefreshIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="GSC Insights">
                            <IconButton sx={{ bgcolor: alpha("#3B82F6", 0.05), color: "#3B82F6", "&:hover": { bgcolor: "#3B82F6", color: "white" } }}>
                              <SearchIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Site">
                            <IconButton sx={{ bgcolor: alpha("#EF4444", 0.05), color: "error.main", "&:hover": { bgcolor: "error.main", color: "white" } }}>
                              <DeleteOutlineIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            ))
          ) : (
            <Box>
              <Box
                sx={{
                  py: 12,
                  textAlign: "center",
                  bgcolor: "white",
                  borderRadius: "32px",
                  border: "2px dashed",
                  borderColor: "rgba(0,0,0,0.05)",
                }}
              >
                <Stack spacing={2} alignItems="center">
                  <PublicIcon sx={{ fontSize: 48, color: "text.secondary", opacity: 0.2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No websites added yet.
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    sx={{ borderRadius: "12px", px: 4, py: 1.5 }}
                  >
                    Add Your First Site
                  </Button>
                </Stack>
              </Box>
            </Box>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
