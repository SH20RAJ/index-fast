"use client";

import {
  alpha,
  Badge,
  Box,
  Card,
  CardContent,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@/components/ui/mui";
import { DeleteOutlineIcon } from "@/components/icons/mui-icons";
import { PublicIcon } from "@/components/icons/mui-icons";
import { BoltIcon } from "@/components/icons/mui-icons";
import { RefreshIcon } from "@/components/icons/mui-icons";
import { SearchIcon } from "@/components/icons/mui-icons";
import { AssessmentOutlinedIcon } from "@/components/icons/mui-icons";
import Link from "next/link";
import { Website } from "@/components/dashboard/types";

interface SiteCardProps {
  site: Website;
  onSync: (id: string) => void;
  onOpenGsc?: (id: string) => void;
  onDeleteSite?: (id: string) => void;
}

export default function SiteCard({ site, onSync, onOpenGsc, onDeleteSite }: SiteCardProps) {
  return (
    <Card
      sx={{
        borderRadius: "18px",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "none",
        "&:hover": {
          borderColor: "divider",
        },
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
                <Typography variant="h6" fontWeight={800} color="text.primary">
                  {new URL(site.url).hostname}
                </Typography>
                {site.isPro && (
                  <Tooltip title="Pro Plan Active">
                    <Badge
                      badgeContent={<BoltIcon sx={{ fontSize: 12, color: "white" }} />}
                      sx={{
                        "& .MuiBadge-badge": {
                          bgcolor: "secondary.main",
                          border: "2px solid",
                          borderColor: "background.paper",
                        },
                      }}
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
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={700}
                sx={{ textTransform: "uppercase" }}
              >
                Last Sync
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {site.lastSyncAt ? new Date(site.lastSyncAt).toLocaleString() : "Never"}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              <Tooltip title="Sync Sitemap">
                <IconButton
                  aria-label="Sync sitemap"
                  onClick={() => onSync(site.id)}
                  sx={{
                    bgcolor: alpha("#7C3AED", 0.05),
                    color: "primary.main",
                    "&:hover": { bgcolor: "primary.main", color: "white" },
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="AI SEO Audit">
                <IconButton
                  aria-label="Open AI SEO audit"
                  component={Link}
                  href={`/sites/${site.id}/audit`}
                  sx={{
                    bgcolor: alpha("#10B981", 0.05),
                    color: "#10B981",
                    "&:hover": { bgcolor: "#10B981", color: "white" },
                  }}
                >
                  <AssessmentOutlinedIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="GSC Insights">
                <IconButton
                  aria-label="Open GSC insights"
                  onClick={onOpenGsc ? () => onOpenGsc(site.id) : undefined}
                  disabled={!onOpenGsc}
                  sx={{
                    bgcolor: alpha("#3B82F6", 0.05),
                    color: "#3B82F6",
                    "&:hover": { bgcolor: "#3B82F6", color: "white" },
                  }}
                >
                  <SearchIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Site">
                <IconButton
                  aria-label="Delete site"
                  onClick={onDeleteSite ? () => onDeleteSite(site.id) : undefined}
                  disabled={!onDeleteSite}
                  sx={{
                    bgcolor: alpha("#EF4444", 0.05),
                    color: "error.main",
                    "&:hover": { bgcolor: "error.main", color: "white" },
                  }}
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}