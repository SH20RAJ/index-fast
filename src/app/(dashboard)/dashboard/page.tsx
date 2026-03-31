import { Box } from "@mui/material";
import DashboardOverview from "@/components/dashboard/overview/DashboardOverview";
import { loadDashboardData } from "@/app/(dashboard)/actions";

export default async function DashboardPage() {
  const data = await loadDashboardData();

  return (
    <Box sx={{ pt: 1, pb: 8 }}>
      <DashboardOverview data={data} />
    </Box>
  );
}
