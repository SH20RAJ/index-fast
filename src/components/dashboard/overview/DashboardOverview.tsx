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
          borderRadius: "24px",
          border: "1px solid",
          borderColor: alpha("#000", 0.08),
          bgcolor: "#fff",
          boxShadow: "0 4px 20px -12px rgba(0,0,0,0.1)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4.5 } }}>
          <Stack spacing={3}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={3} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }}>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                  <Chip
                    label="Live Analytics"
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "0.65rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      bgcolor: alpha("#0EA5E9", 0.1),
                      color: "#0EA5E9",
                      border: `1px solid ${alpha("#0EA5E9", 0.2)}`,
                    }}
                  />
                </Stack>
                <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: "-0.02em", color: "#0F172A", mb: 1 }}>
                  Operations Center
                </Typography>
                <Typography sx={{ color: "text.secondary", maxWidth: 600, fontSize: "1.05rem", lineHeight: 1.6 }}>
                  Track your indexing pipeline velocity, monitor site health, and manage your subscription resources in real-time.
                </Typography>
              </Box>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <Button
                  component="a"
                  href="/sites"
                  variant="contained"
                  disableElevation
                  startIcon={<AddCircleOutlineIcon />}
                  sx={{
                    borderRadius: "14px",
                    px: 3,
                    py: 1.25,
                    textTransform: "none",
                    bgcolor: "#0F172A",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    "&:hover": { bgcolor: "#1E293B" },
                  }}
                >
                  Add Website
                </Button>
                <Button
                  component="a"
                  href="/settings"
                  variant="outlined"
                  sx={{
                    borderRadius: "14px",
                    px: 3,
                    py: 1.25,
                    textTransform: "none",
                    color: "#0F172A",
                    borderColor: alpha("#0F172A", 0.15),
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    "&:hover": { borderColor: "#0F172A", bgcolor: alpha("#0F172A", 0.04) },
                  }}
                >
                  Subscription
                </Button>
              </Stack>
            </Stack>

            <Stack direction="row" spacing={1.5}>
              <Chip
                icon={<BoltIcon sx={{ color: "inherit !important", fontSize: "0.9rem" }} />}
                label={`${data.plan.name} Tier`}
                sx={{
                  bgcolor: "#fff",
                  color: "#0F172A",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  border: "1px solid",
                  borderColor: alpha("#0F172A", 0.08),
                  height: 32,
                  px: 0.5,
                }}
              />
              <Chip
                icon={<CalendarMonthIcon sx={{ color: "inherit !important", fontSize: "0.9rem" }} />}
                label={`$${data.plan.priceMonthly}/mo`}
                sx={{
                  bgcolor: "#fff",
                  color: "#0F172A",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  border: "1px solid",
                  borderColor: alpha("#0F172A", 0.08),
                  height: 32,
                  px: 0.5,
                }}
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={2.5}>
        {[
          { label: "Active Sites", value: formatNumber(data.websitesCount), icon: <HubIcon />, color: "#0F172A" },
          { label: "Total Submissions", value: formatNumber(data.submissionsThisMonth), icon: <AutoGraphIcon />, color: "#0F172A" },
          { label: "Success Rate", value: data.submissionsThisMonth > 0 ? `${Math.round((data.successfulThisMonth / data.submissionsThisMonth) * 100)}%` : "0%", icon: <DoneAllIcon />, color: "#10B981" },
          { label: "Plan Capacity", value: `${formatNumber(data.usage.websitesLimit)} Max`, icon: <BoltIcon />, color: "#F59E0B" },
        ].map((metric) => (
          <Grid key={metric.label} item xs={12} sm={6} lg={3}>
            <Card sx={{ borderRadius: "20px", border: "1px solid", borderColor: alpha("#000", 0.06), boxShadow: "none", transition: "all 0.2s", "&:hover": { borderColor: alpha(metric.color, 0.2), transform: "translateY(-2px)" } }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={2.5} alignItems="center">
                  <Avatar sx={{ width: 48, height: 48, bgcolor: alpha(metric.color, 0.05), color: metric.color, borderRadius: "14px", border: `1px solid ${alpha(metric.color, 0.1)}` }}>
                    {metric.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: "#0F172A", mb: 0.2 }}>
                      {metric.value}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.7rem" }}>
                      {metric.label}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: "20px", border: "1px solid", borderColor: alpha("#000", 0.06), boxShadow: "none", height: "100%", bgcolor: alpha("#F8FAFC", 0.5) }}>
            <CardContent sx={{ p: 3.5 }}>
              <Stack spacing={3}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A" }}>
                  Resources & Quota
                </Typography>

                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: "#0F172A" }}>Websites</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: "#0F172A" }}>
                      {data.usage.websitesUsed} <Box component="span" sx={{ opacity: 0.4, fontWeight: 500 }}>/</Box> {formatNumber(data.usage.websitesLimit)}
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={websiteRatio}
                    sx={{
                      height: 10,
                      borderRadius: "5px",
                      bgcolor: alpha("#0EA5E9", 0.1),
                      "& .MuiLinearProgress-bar": { bgcolor: "#0EA5E9", borderRadius: "5px" },
                    }}
                  />
                </Box>
 
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: "#0F172A" }}>Monthly Submissions</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: "#0F172A" }}>
                      {formatNumber(data.usage.submissionsUsed)} <Box component="span" sx={{ opacity: 0.4, fontWeight: 500 }}>/</Box> {formatNumber(data.usage.submissionsLimit)}
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={submissionRatio}
                    sx={{
                      height: 10,
                      borderRadius: "5px",
                      bgcolor: alpha("#0F172A", 0.08),
                      "& .MuiLinearProgress-bar": { bgcolor: "#0F172A", borderRadius: "5px" },
                    }}
                  />
                </Box>

                <Typography variant="body2" sx={{ color: "text.secondary", bgcolor: "#fff", p: 2, borderRadius: "12px", border: "1px solid", borderColor: alpha("#000", 0.04), fontSize: "0.85rem" }}>
                  {data.plan.tagline}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: "20px", border: "1px solid", borderColor: alpha("#000", 0.06), boxShadow: "none", height: "100%" }}>
            <CardContent sx={{ p: 3.5 }}>
              <Stack spacing={2.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A" }}>
                    Activity Stream
                  </Typography>
                  <Button
                    component="a"
                    href="/submissions"
                    variant="text"
                    endIcon={<OpenInNewIcon sx={{ fontSize: "1.1rem !important" }} />}
                    sx={{ textTransform: "none", fontWeight: 800, color: "#0F172A", "&:hover": { bgcolor: alpha("#0F172A", 0.05) } }}
                  >
                    View History
                  </Button>
                </Stack>

                {data.recentSubmissions.length === 0 ? (
                  <Box sx={{
                    py: 8,
                    textAlign: "center",
                    bgcolor: alpha("#F8FAFC", 0.5),
                    borderRadius: "16px",
                    border: "1px dashed",
                    borderColor: alpha("#000", 0.1),
                  }}>
                    <AutoGraphIcon sx={{ fontSize: 44, color: alpha("#0F172A", 0.15), mb: 2 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary", px: 5, maxWidth: 320, mx: "auto", lineHeight: 1.6 }}>
                      Your indexing pipeline is empty. Add a site to start monitoring submissions.
                    </Typography>
                  </Box>
                ) : (
                  <Stack spacing={1.25}>
                    {data.recentSubmissions.map((entry) => (
                      <Stack
                        key={entry.id}
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        justifyContent="space-between"
                        sx={{
                          p: 1.75,
                          borderRadius: "14px",
                          border: "1px solid",
                          borderColor: alpha("#0F172A", 0.05),
                          transition: "all 0.2s",
                          "&:hover": { borderColor: alpha("#0F172A", 0.15), bgcolor: alpha("#F8FAFC", 0.5) }
                        }}
                      >
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="body2" sx={{ fontWeight: 800, color: "#0F172A" }} noWrap>
                            {entry.websiteUrl ?? "Site"}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }} noWrap>
                            {entry.url}
                          </Typography>
                        </Box>
                        <Stack direction="row" spacing={1.25} alignItems="center">
                          <Chip size="small" label={entry.engine.toUpperCase()} sx={{ fontWeight: 800, bgcolor: alpha("#0F172A", 0.04), borderRadius: "6px" }} />
                          <Chip
                            size="small"
                            label={entry.status.toUpperCase()}
                            sx={{
                              fontWeight: 800,
                              borderRadius: "6px",
                              bgcolor: entry.status === "success" ? alpha("#10B981", 0.12) : alpha("#EF4444", 0.1),
                              color: entry.status === "success" ? "#059669" : "#DC2626",
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

      <Card sx={{ borderRadius: "20px", border: "1px solid", borderColor: alpha("#000", 0.06), boxShadow: "none" }}>
        <CardContent sx={{ p: 3.5 }}>
          <Stack spacing={2.5}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A" }}>
              High-Traffic Assets
            </Typography>
            {data.topSites.length === 0 ? (
              <Box sx={{
                py: 6,
                textAlign: "center",
                bgcolor: alpha("#6366F1", 0.025),
                borderRadius: "16px",
                border: "1px dashed",
                borderColor: alpha("#6366F1", 0.15),
              }}>
                <HubIcon sx={{ fontSize: 40, color: alpha("#6366F1", 0.15), mb: 2 }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary" }}>
                  Connect your first property to track traffic.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={1.25}>
                {data.topSites.map((site) => (
                  <Stack
                    key={site.id}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ 
                      p: 1.75, 
                      borderRadius: "14px", 
                      border: "1px solid", 
                      borderColor: alpha("#0F172A", 0.05),
                      "&:hover": { borderColor: alpha("#0F172A", 0.15), bgcolor: alpha("#F8FAFC", 0.5) }
                    }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: "#0F172A" }} noWrap>{site.url}</Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        Last sync: {site.lastSyncAt ? new Date(site.lastSyncAt).toLocaleString() : "Pending first sync"}
                      </Typography>
                    </Box>
                    <Chip 
                      label={`${formatNumber(site.submissions)} submissions`} 
                      sx={{ 
                        fontWeight: 800, 
                        bgcolor: "#F1F5F9", 
                        borderRadius: "8px",
                        border: "1px solid",
                        borderColor: alpha("#000", 0.04)
                      }} 
                    />
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

