import { Box, Typography, Stack, Grid, Button, alpha } from "@mui/material";
import StatsCard from "@/components/dashboard/StatsCard";
import SpeedIcon from "@mui/icons-material/Speed";
import LanguageIcon from "@mui/icons-material/Language";
import HistoryIcon from "@mui/icons-material/History";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <Box sx={{ pt: 2, pb: 8 }}>
      <Stack spacing={4}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
          <Box>
            <Typography variant="h3" fontWeight={900} color="#111827" sx={{ mb: 1 }}>
              Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome back! Here&apos;s your indexing overview.
            </Typography>
          </Box>
          <Link href="/sites" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                py: 1.5,
                px: 3,
                borderRadius: "14px",
                boxShadow: "0 10px 40px rgba(124, 58, 237, 0.2)",
                "&:hover": { boxShadow: "0 15px 50px rgba(124, 58, 237, 0.3)" },
              }}
            >
              Add Website
            </Button>
          </Link>
        </Stack>

        {/* Stats Grid */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
          <Box sx={{ flex: 1 }}>
            <StatsCard
              title="Total Indexed"
              value="1,284"
              icon={<SpeedIcon />}
              color="#7C3AED"
              trend="+12%"
              trendType="up"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatsCard
              title="Websites"
              value="12"
              icon={<LanguageIcon />}
              color="#3B82F6"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatsCard
              title="Pending URLs"
              value="42"
              icon={<HistoryIcon />}
              color="#F59E0B"
              trend="-5%"
              trendType="down"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatsCard
              title="AI Score"
              value="94/100"
              icon={<AutoFixHighIcon />}
              color="#10B981"
            />
          </Box>
        </Stack>

        {/* Recent Submissions & Sites */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
          <Box
            sx={{
              flex: 2,
              p: 4,
              bgcolor: "white",
              borderRadius: "32px",
              border: "1px solid",
              borderColor: "rgba(0,0,0,0.05)",
              minHeight: 400,
            }}
          >
            <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>
              Recent Submissions
            </Typography>
            <Stack spacing={2} alignItems="center" justifyContent="center" sx={{ height: 300, color: "text.secondary" }}>
              <HistoryIcon sx={{ fontSize: 48, opacity: 0.2 }} />
              <Typography variant="body2">No recent submissions to show.</Typography>
            </Stack>
          </Box>
          <Box
            sx={{
              flex: 1,
              p: 4,
              bgcolor: "white",
              borderRadius: "32px",
              border: "1px solid",
              borderColor: "rgba(0,0,0,0.05)",
              minHeight: 400,
            }}
          >
            <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>
              Active Sites
            </Typography>
            <Stack spacing={2} alignItems="center" justifyContent="center" sx={{ height: 300, color: "text.secondary" }}>
              <LanguageIcon sx={{ fontSize: 48, opacity: 0.2 }} />
              <Typography variant="body2">Add your first site to start tracking.</Typography>
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}
