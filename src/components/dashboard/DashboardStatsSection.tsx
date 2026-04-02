import { Activity, Globe, History, Zap } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";

export default function DashboardStatsSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Total Indexed"
        value="1,284"
        icon={<TrendingUp className="h-5 w-5" />}
        color="#7C3AED"
        trend="+12%"
        trendType="up"
      />
      <StatsCard
        title="Websites"
        value="12"
        icon={<Globe className="h-5 w-5" />}
        color="#3B82F6"
      />
      <StatsCard
        title="Pending URLs"
        value="42"
        icon={<History className="h-5 w-5" />}
        color="#F59E0B"
        trend="-5%"
        trendType="down"
      />
      <StatsCard
        title="AI Score"
        value="94/100"
        icon={<Zap className="h-5 w-5" />}
        color="#10B981"
      />
    </div>
  );
}

function TrendingUp(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}