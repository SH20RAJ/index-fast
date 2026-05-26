import StatsCard from "@/components/dashboard/StatsCard";

export default function DashboardStatsSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
      <StatsCard title="Total Indexed" value="1,284" trend="+12%" trendType="up" />
      <StatsCard title="Websites" value="12" />
      <StatsCard title="Pending URLs" value="42" trend="-5%" trendType="down" />
      <StatsCard title="AI Score" value="94/100" />
    </div>
  );
}
