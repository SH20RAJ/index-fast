import { Box, Stack } from "@/components/ui/mui";
import { SpeedIcon } from "@/components/icons/mui-icons";
import { LanguageIcon } from "@/components/icons/mui-icons";
import { HistoryIcon } from "@/components/icons/mui-icons";
import { AutoFixHighIcon } from "@/components/icons/mui-icons";
import StatsCard from "@/components/dashboard/StatsCard";

export default function DashboardStatsSection() {
  return (
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
  );
}