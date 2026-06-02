import { cn } from "~/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F8F9FA] text-[#6B7280]">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-[#1C1C1E]">{title}</h3>
      {description && <p className="mt-1 text-sm text-[#6B7280] max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
