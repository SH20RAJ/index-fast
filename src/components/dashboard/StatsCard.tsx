import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
  trendType?: "up" | "down";
}

export default function StatsCard({ title, value, icon, color, trend, trendType }: StatsCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div 
          className="flex h-12 w-12 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${color}15`, color: color }}
        >
          {icon}
        </div>
        {trend && (
          <div className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-bold",
            trendType === "up" 
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
              : "bg-red-500/10 text-red-600 dark:text-red-400"
          )}>
            {trend}
          </div>
        )}
      </div>
      <div className="mt-4 space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
          {title}
        </p>
        <h3 className="text-2xl font-extrabold tracking-tight">
          {value}
        </h3>
      </div>
    </div>
  );
}
