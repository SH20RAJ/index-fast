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

function formatNumber(num: number) {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return num.toString();
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
          borderColor: alpha("#1E293B", 0.1),
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
          color: "#F8FAFC",
          boxShadow: "0 10px 30px -10px rgba(15,23,42,0.5)",
          position: "relative",
          overflow: "hidden",
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0, right: 0, bottom: 0, left: 0,
            background: "radial-gradient(circle at top right, rgba(14,165,233,0.15), transparent 60%)",
            pointerEvents: "none",
          }
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
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
                icon={<BoltIcon sx={{ color: "inherit !important", fontSize: "1rem" }} />}
                label={`${data.plan.name} plan`}
                sx={{
                  bgcolor: alpha("#FDE68A", 1),
                  color: "#0F172A",
                  fontWeight: 900,
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  height: 28,
                }}
              />
              <Chip
                icon={<CalendarMonthIcon sx={{ color: "inherit !important", fontSize: "1rem" }} />}
                label={`$${data.plan.priceMonthly}/month`}
                sx={{
                  bgcolor: alpha("#FEF3C7", 0.9),
                  color: "#0F172A",
                  fontWeight: 900,
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  height: 28,
                }}
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        {[
          { label: "Active Websites", value: formatNumber(data.websitesCount), icon: <HubIcon />, color: "#0EA5E9" },
          { label: "Submissions (MTD)", value: formatNumber(data.submissionsThisMonth), icon: <AutoGraphIcon />, color: "#6366F1" },
          { label: "Successful (MTD)", value: formatNumber(data.successfulThisMonth), icon: <DoneAllIcon />, color: "#10B981" },
          { label: "Plan Capacity", value: `${formatNumber(data.usage.websitesLimit)} sites`, icon: <BoltIcon />, color: "#F59E0B" },
        ].map((metric) => (
          <Grid key={metric.label} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card sx={{ borderRadius: "16px", border: "1px solid", borderColor: "divider", boxShadow: "none", transition: "all 0.2s", "&:hover": { borderColor: metric.color, bgcolor: alpha(metric.color, 0.02) } }}>
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ width: 44, height: 44, bgcolor: alpha(metric.color, 0.1), color: metric.color, borderRadius: "12px" }}>
                    {metric.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 900, mb: 0.1 }}>
                      {metric.value}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      {metric.label}
                    </Typography>
                  </Box>
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
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>Websites</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: "text.secondary" }}>
                      {data.usage.websitesUsed} <Box component="span" sx={{ opacity: 0.5, fontWeight: 500 }}>/</Box> {formatNumber(data.usage.websitesLimit)}
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={websiteRatio}
                    sx={{
                      height: 8,
                      borderRadius: "4px",
                      bgcolor: alpha("#0EA5E9", 0.1),
                      "& .MuiLinearProgress-bar": { bgcolor: "#0EA5E9", borderRadius: "4px" },
                    }}
                  />
                </Box>
 
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>Monthly submissions</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: "text.secondary" }}>
                      {formatNumber(data.usage.submissionsUsed)} <Box component="span" sx={{ opacity: 0.5, fontWeight: 500 }}>/</Box> {formatNumber(data.usage.submissionsLimit)}
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={submissionRatio}
                    sx={{
                      height: 8,
                      borderRadius: "4px",
                      bgcolor: alpha("#6366F1", 0.1),
                      "& .MuiLinearProgress-bar": { bgcolor: "#6366F1", borderRadius: "4px" },
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
                  <Box sx={{
                    py: 6,
                    textAlign: "center",
                    bgcolor: alpha("#0EA5E9", 0.03),
                    borderRadius: "12px",
                    border: "1px dashed",
                    borderColor: alpha("#0EA5E9", 0.2),
                  }}>
                    <AutoGraphIcon sx={{ fontSize: 40, color: alpha("#0EA5E9", 0.3), mb: 1.5 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary", px: 4 }}>
                      No submissions yet. Add a website and run your first sync to start the timeline.
                    </Typography>
                  </Box>
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
              <Box sx={{
                py: 5,
                textAlign: "center",
                bgcolor: alpha("#6366F1", 0.03),
                borderRadius: "12px",
                border: "1px dashed",
                borderColor: alpha("#6366F1", 0.2),
              }}>
                <HubIcon sx={{ fontSize: 36, color: alpha("#6366F1", 0.3), mb: 1.5 }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary" }}>
                  No active sites yet.
                </Typography>
              </Box>
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
