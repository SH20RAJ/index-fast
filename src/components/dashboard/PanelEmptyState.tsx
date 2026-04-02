import { cn } from "@/lib/utils";

interface PanelEmptyStateProps {
  icon: React.ReactNode;
  message: string;
  height?: number | string;
}

export default function PanelEmptyState({
  icon,
  message,
  height = 300,
}: PanelEmptyStateProps) {
  return (
    <div 
      className="flex flex-col items-center justify-center gap-3 text-muted-foreground"
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    >
      <div className="text-muted-foreground/50">
        {icon}
      </div>
      <p className="text-sm font-medium tracking-tight">
        {message}
      </p>
    </div>
  );
}