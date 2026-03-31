import { Box, Button, Stack } from "@mui/material";
import PageHeader from "@/components/dashboard/PageHeader";
import DashboardPanel from "@/components/dashboard/DashboardPanel";
import PanelEmptyState from "@/components/dashboard/PanelEmptyState";
import DashboardStatsSection from "@/components/dashboard/DashboardStatsSection";
import LanguageIcon from "@mui/icons-material/Language";
import HistoryIcon from "@mui/icons-material/History";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <Box sx={{ pt: 2, pb: 8 }}>
      <Stack spacing={4}>
        <PageHeader
          title="Dashboard"
          description="Welcome back! Here&apos;s your indexing overview."
          action={
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
          }
        />

        <DashboardStatsSection />

        <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
          <DashboardPanel title="Recent Submissions" flex={2}>
            <PanelEmptyState
              icon={<HistoryIcon sx={{ fontSize: 48, opacity: 0.2 }} />}
              message="No recent submissions to show."
            />
          </DashboardPanel>
          <DashboardPanel title="Active Sites" flex={1}>
            <PanelEmptyState
              icon={<LanguageIcon sx={{ fontSize: 48, opacity: 0.2 }} />}
              message="Add your first site to start tracking."
            />
          </DashboardPanel>
        </Stack>
      </Stack>
    </Box>
  );
}
