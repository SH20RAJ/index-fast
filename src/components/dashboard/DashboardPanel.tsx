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
  minHeight,
  flex,
  children,
  className,
}: DashboardPanelProps) {
  return (
    <div
      style={minHeight ? { minHeight, flex } : flex ? { flex } : undefined}
      className={cn("border border-border bg-card", className)}
    >
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-sm font-medium text-foreground">{title}</h2>
      </div>
      <div className="px-4 py-3">{children}</div>
    </div>
  );
}
