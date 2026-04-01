import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import BoltIcon from "@mui/icons-material/Bolt";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import HubIcon from "@mui/icons-material/Hub";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import type { DashboardData } from "@/app/(dashboard)/actions";

interface DashboardOverviewProps {
  data: DashboardData;
}

function ratio(used: number, limit: number) {
  if (limit <= 0) {
    return 0;
  }
  return Math.min(100, Math.round((used / limit) * 100));
}

export default function DashboardOverview({ data }: DashboardOverviewProps) {
  const websiteRatio = ratio(data.usage.websitesUsed, data.usage.websitesLimit);
  const submissionRatio = ratio(data.usage.submissionsUsed, data.usage.submissionsLimit);

  return (
    <Stack spacing={3.5}>
      <Card
        sx={{
          borderRadius: "20px",
          border: "1px solid",
          borderColor: "divider",
          background: "linear-gradient(120deg, rgba(15,23,42,0.94) 0%, rgba(30,41,59,0.92) 100%)",
          color: "#F8FAFC",
          boxShadow: "none",
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
          <Stack spacing={2.25}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }}>
              <Box>
                <Typography variant="overline" sx={{ color: alpha("#F8FAFC", 0.84), letterSpacing: "0.08em" }}>
                  Operations Hub
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 900 }}>
                  Indexing Mission Control
                </Typography>
                <Typography sx={{ mt: 0.7, color: alpha("#F8FAFC", 0.85), maxWidth: 680 }}>
                  Keep pipeline velocity high, track subscription headroom, and watch every submission pulse in one place.
                </Typography>
              </Box>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
                <Button
                  component="a"
                  href="/sites"
                  variant="contained"
                  startIcon={<AddCircleOutlineIcon />}
                  sx={{
                    borderRadius: "12px",
                    textTransform: "none",
                    bgcolor: "#F8FAFC",
                    color: "#0F172A",
                    fontWeight: 800,
                    "&:hover": { bgcolor: "#E2E8F0" },
                  }}
                >
                  Add Website
                </Button>
                <Button
                  component="a"
                  href="/settings"
                  variant="outlined"
                  sx={{
                    borderRadius: "12px",
                    textTransform: "none",
                    color: "#F8FAFC",
                    borderColor: alpha("#F8FAFC", 0.6),
                    fontWeight: 800,
                    "&:hover": { borderColor: "#F8FAFC", bgcolor: alpha("#F8FAFC", 0.08) },
                  }}
                >
                  Manage Plan
                </Button>
              </Stack>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <Chip
                icon={<BoltIcon sx={{ color: "#0F172A !important" }} />}
                label={`${data.plan.name} plan`}
                sx={{ bgcolor: "#FDE68A", color: "#0F172A", fontWeight: 800 }}
              />
              <Chip
                icon={<CalendarMonthIcon sx={{ color: "#0F172A !important" }} />}
                label={`$${data.plan.priceMonthly}/month`}
                sx={{ bgcolor: "#FEF3C7", color: "#0F172A", fontWeight: 800 }}
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        {[
          { label: "Sites in Workspace", value: data.websitesCount, icon: <HubIcon />, color: "#0EA5E9" },
          { label: "Submissions This Month", value: data.submissionsThisMonth, icon: <AutoGraphIcon />, color: "#475569" },
          { label: "Successful This Month", value: data.successfulThisMonth, icon: <DoneAllIcon />, color: "#0F766E" },
          { label: "Plan Capacity", value: `${data.usage.websitesLimit} sites`, icon: <BoltIcon />, color: "#334155" },
        ].map((metric) => (
          <Grid key={metric.label} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card sx={{ borderRadius: "14px", border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
              <CardContent sx={{ p: 2.25 }}>
                <Stack spacing={1.25}>
                  <Avatar sx={{ width: 36, height: 36, bgcolor: alpha(metric.color, 0.16), color: metric.color }}>
                    {metric.icon}
                  </Avatar>
                  <Typography variant="h5" sx={{ fontWeight: 900 }}>
                    {metric.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {metric.label}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ borderRadius: "16px", border: "1px solid", borderColor: "divider", boxShadow: "none", height: "100%" }}>
            <CardContent sx={{ p: 2.5 }}>
              <Stack spacing={2.25}>
                <Typography variant="h6" sx={{ fontWeight: 850 }}>
                  Subscription Usage
                </Typography>

                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                    <Typography variant="body2" color="text.secondary">Websites</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>
                      {data.usage.websitesUsed} / {data.usage.websitesLimit}
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={websiteRatio}
                    sx={{
                      height: 9,
                      borderRadius: "999px",
                      bgcolor: alpha("#0F766E", 0.12),
                      "& .MuiLinearProgress-bar": { bgcolor: "#0F766E" },
                    }}
                  />
                </Box>

                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                    <Typography variant="body2" color="text.secondary">Monthly submissions</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>
                      {data.usage.submissionsUsed} / {data.usage.submissionsLimit}
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={submissionRatio}
                    sx={{
                      height: 9,
                      borderRadius: "999px",
                      bgcolor: alpha("#B45309", 0.14),
                      "& .MuiLinearProgress-bar": { bgcolor: "#B45309" },
                    }}
                  />
                </Box>

                <Typography variant="body2" color="text.secondary">
                  {data.plan.tagline}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ borderRadius: "16px", border: "1px solid", borderColor: "divider", boxShadow: "none", height: "100%" }}>
            <CardContent sx={{ p: 2.5 }}>
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" sx={{ fontWeight: 850 }}>
                    Recent Submission Stream
                  </Typography>
                  <Button
                    component="a"
                    href="/submissions"
                    endIcon={<OpenInNewIcon />}
                    sx={{ textTransform: "none", fontWeight: 700 }}
                  >
                    Open all
                  </Button>
                </Stack>

                {data.recentSubmissions.length === 0 ? (
                  <Typography color="text.secondary">No submissions yet. Run your first sync to start the timeline.</Typography>
                ) : (
                  <Stack spacing={1}>
                    {data.recentSubmissions.map((entry) => (
                      <Stack
                        key={entry.id}
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1}
                        justifyContent="space-between"
                        sx={{
                          p: 1.25,
                          borderRadius: "12px",
                          border: "1px solid",
                          borderColor: alpha("#0F172A", 0.08),
                        }}
                      >
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
                            {entry.websiteUrl ?? "Unknown site"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: "block" }} noWrap>
                            {entry.url}
                          </Typography>
                        </Box>
                        <Stack direction="row" spacing={1}>
                          <Chip size="small" label={entry.engine.toUpperCase()} sx={{ fontWeight: 800 }} />
                          <Chip
                            size="small"
                            label={entry.status.toUpperCase()}
                            sx={{
                              fontWeight: 800,
                              bgcolor: entry.status === "success" ? alpha("#15803D", 0.14) : alpha("#B91C1C", 0.12),
                              color: entry.status === "success" ? "#15803D" : "#B91C1C",
                            }}
                          />
                        </Stack>
                      </Stack>
                    ))}
                  </Stack>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ borderRadius: "16px", border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
        <CardContent sx={{ p: 2.5 }}>
          <Stack spacing={1.5}>
            <Typography variant="h6" sx={{ fontWeight: 850 }}>
              Highest Activity Sites
            </Typography>
            {data.topSites.length === 0 ? (
              <Typography color="text.secondary">No sites yet. Add your first website to populate this leaderboard.</Typography>
            ) : (
              <Stack spacing={1}>
                {data.topSites.map((site) => (
                  <Stack
                    key={site.id}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ p: 1.25, borderRadius: "12px", border: "1px solid", borderColor: "divider" }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 800 }} noWrap>{site.url}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Last sync: {site.lastSyncAt ? new Date(site.lastSyncAt).toLocaleString() : "Never"}
                      </Typography>
                    </Box>
                    <Chip label={`${site.submissions} submissions`} sx={{ fontWeight: 800 }} />
                  </Stack>
                ))}
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
