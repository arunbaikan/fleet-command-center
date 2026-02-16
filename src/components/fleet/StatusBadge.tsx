import { forwardRef } from "react";
import { LeadStatus, STATUS_MAP } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const colorMap: Record<string, string> = {
  "status-draft": "bg-status-draft/15 text-status-draft",
  "status-pending": "bg-status-pending/15 text-status-pending",
  "status-review": "bg-status-review/15 text-status-review",
  "status-approved": "bg-status-approved/15 text-status-approved",
  "status-disbursed": "bg-status-disbursed/15 text-status-disbursed",
  "status-rejected": "bg-status-rejected/15 text-status-rejected",
};

const StatusBadge = forwardRef<HTMLSpanElement, { status: LeadStatus }>(
  ({ status }, ref) => {
    const info = STATUS_MAP[status];
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide",
          colorMap[info.colorKey]
        )}
      >
        {info.label}
      </span>
    );
  }
);

StatusBadge.displayName = "StatusBadge";

export default StatusBadge;
