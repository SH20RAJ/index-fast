"use client";

interface HealthStatsProps {
  stats: Array<{
    engine: string;
    total: number;
    success: number;
    failed: number;
  }>;
}

export default function HealthStats({ stats }: HealthStatsProps) {
  return (
    <div className="space-y-4 px-1">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Health Stats</h3>
      <div className="space-y-4">
        {stats.map((row) => (
          <div key={row.engine} className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{row.engine}</span>
            <div className="flex gap-2">
              <span className="text-xs font-bold text-emerald-500">{row.success}</span>
              <span className="text-xs font-bold text-rose-500">{row.failed}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
