import { cn } from "@/lib/utils";

interface DashboardPanelProps {
  title: string;
  minHeight?: number;
  flex?: number;
  children: React.ReactNode;
  className?: string;
}

export default function DashboardPanel({
  title,
  minHeight = 400,
  flex,
  children,
  className,
}: DashboardPanelProps) {
  return (
    <div
      style={{ minHeight, flex }}
      className={cn(
        "p-6 md:p-8 bg-card/30 backdrop-blur-sm rounded-[32px] border border-border/40 shadow-sm transition-all hover:shadow-md",
        className
      )}
    >
      <h2 className="text-xl font-black tracking-tighter mb-6 text-foreground/90 uppercase tracking-widest text-[12px] opacity-60">
        {title}
      </h2>
      <div className="relative">
        {children}
      </div>
    </div>
  );
}