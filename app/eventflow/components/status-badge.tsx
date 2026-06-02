import { cn } from "~/lib/utils";

const statusConfig: Record<string, { label: string; className: string }> = {
  // Event statuses
  planning: { label: "Planning", className: "bg-blue-50 text-blue-700 border-blue-200" },
  confirmed: { label: "Confirmed", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  in_progress: { label: "In Progress", className: "bg-amber-50 text-amber-700 border-amber-200" },
  completed: { label: "Completed", className: "bg-gray-50 text-gray-600 border-gray-200" },
  cancelled: { label: "Cancelled", className: "bg-red-50 text-red-700 border-red-200" },
  // Venue statuses
  available: { label: "Available", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  reserved: { label: "Reserved", className: "bg-amber-50 text-amber-700 border-amber-200" },
  unavailable: { label: "Unavailable", className: "bg-red-50 text-red-700 border-red-200" },
  // Vendor statuses
  prospecting: { label: "Prospecting", className: "bg-purple-50 text-purple-700 border-purple-200" },
  contacted: { label: "Contacted", className: "bg-blue-50 text-blue-700 border-blue-200" },
  negotiating: { label: "Negotiating", className: "bg-amber-50 text-amber-700 border-amber-200" },
  booked: { label: "Booked", className: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  // Payment statuses
  unpaid: { label: "Unpaid", className: "bg-red-50 text-red-700 border-red-200" },
  deposit_paid: { label: "Deposit Paid", className: "bg-amber-50 text-amber-700 border-amber-200" },
  partially_paid: { label: "Partial", className: "bg-blue-50 text-blue-700 border-blue-200" },
  paid: { label: "Paid", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  // RSVP statuses
  pending: { label: "Pending", className: "bg-amber-50 text-amber-700 border-amber-200" },
  declined: { label: "Declined", className: "bg-red-50 text-red-700 border-red-200" },
  waitlisted: { label: "Waitlisted", className: "bg-gray-50 text-gray-600 border-gray-200" },
  // Timeline item statuses
  skipped: { label: "Skipped", className: "bg-gray-50 text-gray-500 border-gray-200" },
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, className: "bg-gray-50 text-gray-600 border-gray-200" };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
