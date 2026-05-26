interface StatsCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendType?: "up" | "down";
}

export default function StatsCard({ title, value, trend, trendType }: StatsCardProps) {
  return (
    <div className="border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-foreground tracking-tight">{value}</span>
        {trend && (
          <span className={trendType === "up" ? "text-xs text-emerald-600" : "text-xs text-red-500"}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
