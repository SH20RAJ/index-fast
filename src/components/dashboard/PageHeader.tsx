interface PageHeaderProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-3xl font-light tracking-tight text-zinc-900 dark:text-zinc-100">
          {title}
        </h1>
        <p className="max-w-[640px] text-sm font-light text-zinc-500 dark:text-zinc-400">
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