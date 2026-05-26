import { Button } from "@/components/ui/button";

interface PanelEmptyStateProps {
  icon: React.ReactNode;
  message: string;
  height?: number | string;
  action?: { label: string; onClick: () => void };
}

export default function PanelEmptyState({
  icon,
  message,
  height = 300,
  action,
}: PanelEmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-2 text-muted-foreground"
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    >
      <div className="text-muted-foreground/50">{icon}</div>
      <p className="text-sm">{message}</p>
      {action && (
        <Button variant="outline" size="sm" className="mt-2" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}