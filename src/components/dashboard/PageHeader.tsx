interface PageHeaderProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="max-w-[640px] text-sm font-sans text-muted-foreground">
          {description}
        </p>
      </div>
      {action && (
        <div className="w-full sm:w-auto">
          {action}
        </div>
      )}
    </div>
  );
}